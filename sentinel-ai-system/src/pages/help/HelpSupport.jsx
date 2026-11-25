// ============================================
// SentinelAI - Help & Support Page
// صفحة المساعدة والدعم
// ============================================

import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Book,
  MessageCircle,
  Mail,
  Video,
  FileText,
  Search,
  ExternalLink,
  ChevronRight,
  Phone,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
} from 'lucide-react';

const HelpSupport = () => {
  const categories = [
    { icon: Book, title: 'Documentation', desc: 'دليل الاستخدام الشامل للنظام', articles: 42, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { icon: Video, title: 'Video Tutorials', desc: 'شروحات مصورة للوظائف الرئيسية', articles: 15, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: MessageCircle, title: 'FAQ', desc: 'الأسئلة الشائعة والأجوبة', articles: 28, color: 'text-green-400', bg: 'bg-green-500/10' },
    { icon: FileText, title: 'API Reference', desc: 'توثيق واجهات البرمجة', articles: 64, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];

  const popularTopics = [
    'كيف أنشئ تقريراً أمنياً مخصصاً؟',
    'ما هو الفرق بين Alert و Incident؟',
    'كيف أضيف مصدر بيانات جديد؟',
    'ما هي معايير اكتشاف الشذوذ السلوكي؟',
    'كيف أستخدم Threat Hunting؟',
    'كيف أربط MITRE ATT&CK بالتهديدات؟',
  ];

  const ticketStatus = [
    { id: 'TKT-2026-0421', title: 'Unable to export report in PDF', status: 'Resolved', priority: 'Medium', date: 'Sep 18, 2026', color: 'text-green-400', bg: 'bg-green-500/20' },
    { id: 'TKT-2026-0418', title: 'Endpoint agent not reporting', status: 'In Progress', priority: 'High', date: 'Sep 17, 2026', color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { id: 'TKT-2026-0412', title: 'Feature request: Custom dashboards', status: 'Open', priority: 'Low', date: 'Sep 15, 2026', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  ];

  return (
    <DashboardLayout
      title="Help & Support"
      subtitle="Find answers, learn, and get in touch with our support team."
    >
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-sentinel-panel via-sentinel-panel to-blue-900/20 border border-sentinel-border rounded-xl p-8 mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
            <MessageCircle className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] text-cyan-400 font-medium">How can we help you?</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Help & Support Center
          </h2>
          <p className="text-sm text-sentinel-text-dim mb-6">
            ابحث في قاعدة المعرفة أو تواصل مع فريق الدعم
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sentinel-text-dim" />
            <input
              type="text"
              placeholder="Search for help articles, tutorials, or FAQs..."
              className="w-full bg-sentinel-bg/80 backdrop-blur border border-sentinel-border rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400 outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <button
              key={i}
              className="bg-sentinel-panel border border-sentinel-border rounded-xl p-5 text-left hover:border-cyan-400/50 transition-all group"
            >
              <div className={`inline-flex p-2.5 rounded-lg ${cat.bg} mb-3`}>
                <Icon className={`w-5 h-5 ${cat.color}`} />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{cat.title}</h3>
              <p className="text-xs text-sentinel-text-dim mb-3">{cat.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-sentinel-text-dim">
                  {cat.articles} articles
                </span>
                <ChevronRight className="w-4 h-4 text-sentinel-text-dim group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Popular Topics */}
        <div className="lg:col-span-2 bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Popular Topics</h3>
              <p className="text-xs text-sentinel-text-dim mt-1">المواضيع الأكثر بحثاً</p>
            </div>
            <button className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View All <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {popularTopics.map((topic, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-sentinel-panel-light/40 border border-sentinel-border hover:border-cyan-400/30 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-sentinel-text-dim flex-shrink-0" />
                  <span className="text-sm text-white">{topic}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-sentinel-text-dim group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">Contact Support</h3>
            <p className="text-xs text-sentinel-text-dim mt-1">تواصل مع الفريق</p>
          </div>

          <div className="space-y-3 mb-4">
            <ContactOption
              icon={Mail}
              title="Email Support"
              value="support@sentinel.ai"
              color="text-cyan-400"
              bg="bg-cyan-500/10"
            />
            <ContactOption
              icon={Phone}
              title="Phone Support"
              value="+967 1 234 567"
              color="text-purple-400"
              bg="bg-purple-500/10"
            />
            <ContactOption
              icon={Users}
              title="Live Chat"
              value="Available 24/7"
              color="text-green-400"
              bg="bg-green-500/10"
            />
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium transition-all">
            <Send className="w-4 h-4" />
            Submit a Ticket
          </button>
        </div>
      </div>

      {/* My Tickets */}
      <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">My Support Tickets</h3>
            <p className="text-xs text-sentinel-text-dim mt-1">تذاكر الدعم الخاصة بي</p>
          </div>
          <button className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            View All <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-sentinel-text-dim border-b border-sentinel-border">
                <th className="pb-3 font-medium">Ticket ID</th>
                <th className="pb-3 font-medium">Subject</th>
                <th className="pb-3 font-medium">Priority</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {ticketStatus.map((ticket, i) => (
                <tr key={i} className="border-b border-sentinel-border/50 hover:bg-sentinel-panel-light/50 transition-colors cursor-pointer">
                  <td className="py-3 text-xs text-sentinel-text-dim font-mono">{ticket.id}</td>
                  <td className="py-3 text-sm text-white">{ticket.title}</td>
                  <td className="py-3">
                    <span className={`text-[10px] font-medium ${
                      ticket.priority === 'High' ? 'text-red-400' :
                      ticket.priority === 'Medium' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded ${ticket.bg} ${ticket.color}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-sentinel-text-dim">{ticket.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-6 bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">System Status</h3>
            <p className="text-xs text-sentinel-text-dim mt-1">حالة النظام</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-green-400 font-medium">All Systems Operational</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: 'API Services', status: 'Operational', uptime: '99.98%' },
            { name: 'Data Ingestion', status: 'Operational', uptime: '99.95%' },
            { name: 'AI/ML Engine', status: 'Operational', uptime: '99.99%' },
          ].map((service, i) => (
            <div key={i} className="p-4 rounded-lg bg-sentinel-panel-light/40 border border-sentinel-border">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <p className="text-sm font-medium text-white">{service.name}</p>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-green-400">{service.status}</span>
                <span className="text-sentinel-text-dim">Uptime: {service.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

const ContactOption = ({ icon: Icon, title, value, color, bg }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-sentinel-panel-light/40 border border-sentinel-border hover:border-cyan-400/30 transition-colors cursor-pointer">
    <div className={`p-2 rounded-lg ${bg}`}>
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
    <div>
      <p className="text-xs font-medium text-white">{title}</p>
      <p className="text-[10px] text-sentinel-text-dim mt-0.5">{value}</p>
    </div>
  </div>
);

export default HelpSupport;