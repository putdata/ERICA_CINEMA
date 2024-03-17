const jwt = require('utility/jwt');
const db = require('utility/db');
const sql = require('./sql');

exports.userTokenVerify = async (req, res) => {
  const token = req.body.token;
  try {
    const decoded = await jwt.verify(token);
    console.log(decoded);
    res.json({
      ok: true,
      data: decoded
    });
  } catch (e) {
    res.json({
      ok: false
    });
  }
};

exports.userLogin = async (req, res) => {
  const param = {
    email: req.body.email,
    pw: req.body.pw
  };
  console.log(param);

  const { email, pw } = param;
  if (!email || !pw) {
    res.json({
      ok: false,
      data: {
        message: 'blank exist'
      }
    });
    return;
  }

  let result = {};

  try {
    const get = db.connect(async (conn, email, pw) => {
      const userRes = await conn.query(sql.login, [email, pw]);
      const userRow = userRes[0];
      if (!userRow.length) return false;
      const { name } = userRow[0];

      const adminRes = await conn.query(sql.CheckAdmin, [email]);
      const adminRow = adminRes[0];

      let adminType = "";
      if (adminRow.length) adminType = adminRow[0].type

      return {
        email: email,
        name: name,
        admin: adminType
      }
    });
    
    const res = await get(email, pw);

    if (!res) throw new Error('로그인 실패');

    console.log(res);
    const { name, admin } = res;

    result.ok = true;
    result.data = {
      email: email,
      name: name,
      admin: admin,
      token: await jwt.sign(email, name, admin)
    };
  } catch(e) {
    result.ok = false;
    result.data = {
      message: e.message
    }
  }
  res.json(result);
};

exports.userRegister = async (req, res) => {
  try {
    const regist = db.transaction(async (conn, param) => {
      const { email, name, password, rePassword } = param;
      if (!email || !name || !password || !rePassword) {
        res.json({
          ok: false,
          message: '필드를 모두 채워주세요.'
        });
        return;
      }
      if (password != rePassword) {
        res.json({
          ok: false,
          message: '비밀번호가 같지 않습니다.'
        });
      }
      await conn.query(sql.register, [email, name, password, 99]);
    });
    await regist(req.body);
    res.json({
      ok: true,
      message: '회원가입 완료'
    })
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    });
  }
};

exports.userInfo = async (req, res) => {
  try {
    const userInfo = db.connect(async (conn, email) => {
      const result = await conn.query(sql.UserInfo, [email]);
      return result[0];
    });

    const result = await userInfo(req.query.email);
    if (!result.length) throw new Error('존재하지 않는 유저입니다.');

    res.json({
      ok: true,
      data: result[0]
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    })
  }
};

exports.paymentInfo = async (req, res) => {
  try {
    const paymentInfo = db.connect(async (conn, email) => {
      const result = await conn.query(sql.PaymentInfo, [email]);
      return result[0];
    });
    res.json({
      ok: true,
      data: await paymentInfo(req.query.email)
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    })
  }
};

exports.cancelTicket = async (req, res) => {
  try {
    const cancelTicket = db.transaction(async (conn, email, serialNumber) => {
      console.log(email, serialNumber);
      const checkTime = await conn.query(sql.CheckMovieTime, [serialNumber]);
      if (!checkTime[0].length) throw new Error('취소 할 수 없는 티켓입니다.');
      const priceResult = await conn.query(sql.PaymentPrice, [email, serialNumber]);
      const price = priceResult[0][0].price;

      const userMileage = await conn.query(sql.GetUserMileage, [email]);
      let { grade, mileage, acc_mileage } = userMileage[0][0];
      const calc = Math.floor(price * 0.05);
      mileage -= calc;
      acc_mileage -= calc;
      if (acc_mileage < 2500) grade = 'BRONZE';
      else if (acc_mileage < 5000) grade = 'SILVER';
      else grade = 'GOLD';

      await conn.query(sql.SetUserMileage, [grade, mileage, acc_mileage, email]);
      await conn.query(sql.DeleteTicket, [serialNumber]);
      await conn.query(sql.DeleteBookedSeat, [serialNumber]);
      await conn.query(sql.DeletePayment, [serialNumber]);
    });

    const { email, serialNumber } = req.body;
    await cancelTicket(email, serialNumber);
    res.json({
      ok: true
    })
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    });
  }
};