import createApplication, { createToken } from './factory' 
import passport from "passport"
import _ from "lodash"

const app = createApplication()

app.get('/', function(req, res) {
  res.json({message: "Express is up!"});
});

app.post('/login', function(req, res) {
  const { body: { name, password } } = req
  const token = createToken(name, password)
  if (!token) {
    return res.status(401).json({ message: "User not found" })
  }
  res.status(200).json({ token })

})

app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
  res.json("Success! You can not see this without a token");
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});
