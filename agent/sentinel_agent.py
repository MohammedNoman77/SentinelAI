# ============================================
# SentinelAI Agent - Real Device Monitor
# يعمل على جهازك ويرسل الأحداث للخادم
# ============================================

import sys
import time
import socket
import platform
import subprocess
import requests
import psutil
from datetime import datetime, timezone

# ============================================
# Configuration
# ============================================
API_URL = "http://localhost:5000/api"
API_KEY = "YOUR_API_KEY_HERE"  # ← سنغيّرها لاحقاً
HEARTBEAT_INTERVAL = 30  # ثانية
EVENT_INTERVAL = 10  # ثانية

# ============================================
# Agent Class
# ============================================
class SentinelAgent:
    def __init__(self, api_url, api_key):
        self.api_url = api_url
        self.api_key = api_key
        self.hostname = socket.gethostname()
        self.os_name = platform.system()
        self.os_version = platform.version()
        self.ip_address = self._get_local_ip()
        
        # تتبع الحالة
        self.seen_processes = set()
        self.seen_connections = set()
        self.last_heartbeat = 0
        
        print("🛡️ SentinelAI Agent Starting...")
        print(f"   Hostname: {self.hostname}")
        print(f"   OS: {self.os_name} {self.os_version}")
        print(f"   IP: {self.ip_address}")
        print(f"   API: {api_url}")
        print()

    def _get_local_ip(self):
        """الحصول على IP المحلي"""
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            try:
                s.connect(("8.8.8.8", 80))
                return s.getsockname()[0]
            finally:
                s.close()
        except (OSError, socket.timeout):
            return "127.0.0.1"

    def _headers(self):
        return {
            "X-API-Key": self.api_key,
            "Content-Type": "application/json",
        }

    # ============================================
    # Heartbeat
    # ============================================
    def send_heartbeat(self):
        try:
            response = requests.post(
                f"{self.api_url}/agent/heartbeat",
                headers=self._headers(),
                json={
                    "agentVersion": "1.0.0",
                    "os": self.os_name,
                    "osVersion": self.os_version,
                    "hostname": self.hostname,
                    "ipAddress": self.ip_address,
                },
                timeout=10,
            )
            if response.status_code == 200:
                print("💓 Heartbeat sent")
            else:
                print(f"⚠️  Heartbeat failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Heartbeat error: {e}")

    # ============================================
    # Collect Processes
    # ============================================
    def collect_processes(self):
        events = []
        current_pids = set()

        for proc in psutil.process_iter(['pid', 'name', 'exe', 'cmdline', 'username', 'create_time']):
            try:
                pid = proc.info['pid']
                current_pids.add(pid)
                
                if pid in self.seen_processes:
                    continue

                name = proc.info['name'] or 'unknown'
                exe = proc.info['exe'] or ''
                cmdline = proc.info['cmdline']
                cmd_str = ' '.join(cmdline) if cmdline else ''
                user = proc.info['username'] or 'unknown'
                
                # تحديد الخطورة
                severity = self._assess_process_severity(name, exe, cmd_str)
                
                events.append({
                    "category": "PROCESS",
                    "eventType": "process_started",
                    "title": f"Process started: {name}",
                    "description": f"Command: {cmd_str[:200]}",
                    "severity": severity,
                    "processName": name,
                    "processPath": exe,
                    "processId": pid,
                    "userAccount": user,
                    "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                    "metadata": {
                        "cmdline": cmd_str,
                        "parentPid": self._get_parent_pid(proc),
                    }
                })
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass

        self.seen_processes = current_pids
        return events

    def _get_parent_pid(self, proc):
        try:
            return proc.ppid()
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            return None

    def _assess_process_severity(self, name, exe, cmd):
        """تحديد خطورة العملية بناءً على اسمها"""
        name_lower = name.lower()
        cmd_lower = cmd.lower()

        # عمليات خطرة معروفة
        dangerous = ['mimikatz', 'psexec', 'cain', 'nc.exe', 'netcat', 'nmap']
        for d in dangerous:
            if d in name_lower or d in cmd_lower:
                return "HIGH"

        # PowerShell مع أوامر مشفرة
        if 'powershell' in name_lower and ('-enc' in cmd_lower or '-e ' in cmd_lower):
            return "CRITICAL"

        # أوامر مشبوهة
        suspicious = ['invoke-', 'iex(', 'downloadstring', 'bypass']
        for s in suspicious:
            if s in cmd_lower:
                return "HIGH"

        return "LOW"

    # ============================================
    # Collect Network Connections
    # ============================================
    def collect_connections(self):
        events = []
        current = set()

        try:
            for conn in psutil.net_connections(kind='inet'):
                if not conn.raddr:
                    continue

                key = f"{conn.raddr.ip}:{conn.raddr.port}:{conn.pid}"
                current.add(key)

                if key in self.seen_connections:
                    continue

                # تحديد الخطورة
                severity = self._assess_connection_severity(conn.raddr.ip, conn.raddr.port)

                events.append({
                    "category": "NETWORK",
                    "eventType": "connection_established",
                    "title": f"Connection to {conn.raddr.ip}:{conn.raddr.port}",
                    "description": f"Status: {conn.status}, PID: {conn.pid}",
                    "severity": severity,
                    "destinationIp": conn.raddr.ip,
                    "destinationPort": conn.raddr.port,
                    "metadata": {
                        "localPort": conn.laddr.port if conn.laddr else None,
                        "status": conn.status,
                        "pid": conn.pid,
                    }
                })
        except Exception:
            pass

        self.seen_connections = current
        return events

    def _assess_connection_severity(self, ip, port):
        """تحديد خطورة الاتصال"""
        # منافذ مشبوهة
        suspicious_ports = [4444, 5555, 6666, 7777, 8888, 31337, 1337]
        if port in suspicious_ports:
            return "HIGH"

        # عناوين IP خاصة (آمنة)
        if ip.startswith('192.168.') or ip.startswith('10.') or ip.startswith('127.'):
            return "LOW"

        return "LOW"

    # ============================================
    # Collect Authentication Events
    # ============================================
    def collect_auth_events(self):
        events = []
        
        if self.os_name != "Windows":
            return events

        try:
            # استخدام wevtutil لقراءة آخر أحداث تسجيل الدخول
            result = subprocess.run(
                ['wevtutil', 'qe', 'Security', '/c:5', '/rd:true', '/f:text', '/q:*[System[(EventID=4624)]]'],
                capture_output=True,
                text=True,
                timeout=5,
                encoding='utf-8',
                errors='ignore'
            )
            
            # عدد الأحداث الجديدة
            lines = [l for l in result.stdout.split('\n') if l.strip()]
            if len(lines) > 0:
                # فقط نسجل عدد الأحداث (للتجنب التعقيد)
                pass
        except Exception:
            pass

        return events

    # ============================================
    # Send Events
    # ============================================
    def send_events(self, events):
        if not events:
            return

        try:
            response = requests.post(
                f"{self.api_url}/agent/events",
                headers=self._headers(),
                json={"events": events},
                timeout=15,
            )

            if response.status_code == 200:
                result = response.json()
                print(f"📤 Sent {result['data']['saved']} events")
            else:
                print(f"⚠️  Send failed: {response.status_code} - {response.text[:100]}")
        except Exception as e:
            print(f"❌ Send error: {e}")

    # ============================================
    # Main Loop
    # ============================================
    def run(self):
        print("🟢 Agent is running... Press Ctrl+C to stop\n")
        
        # بناء خط الأساس في أول دورة (بدون إرسال أحداث)
        # حتى لا نغرق الخادم بمئات الأحداث عند بدء التشغيل
        self._baseline_done = False

        try:
            while True:
                # Heartbeat
                if time.time() - self.last_heartbeat > HEARTBEAT_INTERVAL:
                    self.send_heartbeat()
                    self.last_heartbeat = time.time()

                # Collect & send events
                # في الدورة الأولى نكتفي ببناء خط الأساس
                if not self._baseline_done:
                    self.collect_processes()
                    self.collect_connections()
                    self._baseline_done = True
                    print("📊 Baseline built (processes/connections)")
                    time.sleep(EVENT_INTERVAL)
                    continue

                events = []
                events.extend(self.collect_processes())
                events.extend(self.collect_connections())
                
                if events:
                    self.send_events(events)

                time.sleep(EVENT_INTERVAL)

        except KeyboardInterrupt:
            print("\n🛑 Agent stopped by user")


# ============================================
# Entry Point
# ============================================
if __name__ == "__main__":
    if API_KEY == "YOUR_API_KEY_HERE":
        print("⚠️  Please set your API_KEY first!")
        print("   1. Login to SentinelAI")
        print("   2. Go to Devices")
        print("   3. Add a new device")
        print("   4. Copy the API Key")
        print("   5. Paste it in this file (line 18)")
        sys.exit(1)

    agent = SentinelAgent(API_URL, API_KEY)
    agent.run()
