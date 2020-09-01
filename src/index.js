const app = require('express')();
const crypto = require('crypto');
const { updateEmployees } = require('./graph');

const domains = ['srnd.org', 'codeday.org'];

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

let employeesCache = {};
async function updateEmployeesCache() {
  const employees = await updateEmployees();

  employeesCache = employees
    .map((e) => ({
      md5: [md5(e.username), ...domains.map((d) => md5(`${e.username}@${d}`))],
      ...e,
    }));
}

updateEmployeesCache();
setInterval(updateEmployeesCache, 1000 * 60 * 30);

app.get('/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.send('err');
  }

  const employee = employeesCache
    .filter((e) => e.md5.includes(id))[0] || null;

  if (!employee) {
    return res.send('err');
  }

  return res.redirect(employee.picture);
});

app.listen(5000);
