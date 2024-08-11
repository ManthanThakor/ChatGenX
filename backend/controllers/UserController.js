//--------- Registration ---------

const register = async (req, res) => {
  res.json({
    status: true,
    message: "Registration was successful",
  });
};
//--------- Login ---------
//--------- Logout ---------
//--------- Profile ---------
//--------- Check user Auth Status ---------

module.exports = {
  register,
};
