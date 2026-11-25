import * as agent from '../services/agentService.js';
export const enroll = async (req, res, next) => { try { const result = await agent.enrollDevice(req.body); if (!result) return res.status(401).json({ status: 'error', message: 'Invalid enrollment token' }); return res.status(201).json({ status: 'success', data: result }); } catch (error) { return next(error); } };
export const heartbeat = async (req, res, next) => { try { await agent.heartbeat(req.device, req.body); return res.json({ status: 'success', data: { deviceId: req.device.id } }); } catch (error) { return next(error); } };
