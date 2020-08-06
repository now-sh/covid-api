const myHeaders = {
  method: 'GET',
  'Content-Type': 'application/json',
  'User-Agent': process.env.HEADER_AGENT,
  Authorization: `Token ${process.env.GITHUB_API_KEY}`,
};

module.exports = {
  myHeaders,
};
