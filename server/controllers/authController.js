const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const { email, pwd } = req.body;
  if (!email || !pwd) return res.sendStatus('Something is missing');

  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) return res.sendStatus(401).json({ message: 'Unauthorized' });

  const match = await bcrypt.compare(pwd, foundUser.password);

  if (match) {
    const accessToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '30s',
      }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '30m',
      }
    );

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.json({
      id: foundUser._id,
      name: foundUser.name,
      picture: foundUser.picture,
      bio: foundUser.bio,
      location: foundUser.location,
      education: foundUser.education,
      work: foundUser.work,
      availableFor: foundUser.availableFor,
      skills: foundUser.skills,
      token: accessToken,
      expirationDate: Date.now() + 1000 * 30,
      joinDate: foundUser.joinDate,
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
