function getEnv(name, defaultValue) {
  const value = process.env[name] || defaultValue;
  if (!value) throw new Error(`missing env variable '${name}'`);
  return value;
}

module.exports = getEnv;
