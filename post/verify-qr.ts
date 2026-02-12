const payload = verifyToken(req.body.token, process.env.QR_SECRET!);
if (!payload) return res.status(401).json({ ok: false });

return res.json({
  ok: true,
  groupShipmentId: payload.groupShipmentId,
  date: payload.date,
});
