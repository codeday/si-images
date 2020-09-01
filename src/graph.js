const fetch = require('node-fetch');

const query = `
  {
    account {
      roleUsers(roleId: "rol_llN0357VXrEoIxoj") {
        username
        picture(transform:{width:128, height: 128})
      }
    }
  }
`;

module.exports.updateEmployees = async function updateEmployees() {
  const result = await fetch(`https://graph.codeday.org/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ operationName: null, query, variables: {} }),
  });
  return (await result.json()).data.account.roleUsers;
};
