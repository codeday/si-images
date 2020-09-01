const app = require('express')();
const crypto = require('crypto');
const { updateEmployees } = require('./graph');

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

let employeesCache = {};
async function updateEmployeesCache() {
  const employees = await updateEmployees();
  employeesCache = employees
    .map((e) => ({ md5: md5(e.username), ...e }))
    .reduce((accum, e) => ({ ...accum, [e.md5]: e }), {});
}

updateEmployeesCache();
setInterval(updateEmployeesCache, 1000 * 60 * 30);

app.get('/', (req, res) => {
  const { id } = req.query;
  if (!id || !(id in employeesCache)) {
    return res.send('err');
  }

  res.redirect(employeesCache[id].picture);
});

app.listen(5000);
