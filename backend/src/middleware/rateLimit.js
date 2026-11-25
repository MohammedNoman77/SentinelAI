const buckets = new Map();
export const rateLimit = ({ windowMs, max, key = (req) => req.ip }) => (req, res, next) => {
  const now = Date.now(); const bucketKey = key(req); const current = buckets.get(bucketKey);
  const bucket = !current || now >= current.resetAt ? { count: 0, resetAt: now + windowMs } : current;
  bucket.count += 1; buckets.set(bucketKey, bucket);
  if (bucket.count > max) return res.status(429).json({ status: 'error', message: 'Too many requests. Please try again later.' });
  return next();
};
