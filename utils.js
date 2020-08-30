const payload = (action, share, price = 0, updatedAt = Date.now()) => {
  return JSON.stringify({
    action,
    share,
    price,
    updatedAt,
  });
};

module.exports = {
    payload
}