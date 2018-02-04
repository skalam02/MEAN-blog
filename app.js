var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost/my_blog'
} 

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var methodOverride = require('method-override')
var passport = require('passport')
var LocalStrategy = require('passport-local')
var passportLocalMongoose = require('passport-local-mongoose')

var {cBlog} = require('./models/cBlog') 
var {sBlog} = require('./models/sBlog') 
var {proj} = require('./models/proj') 


var PORT = process.env.PORT || 3000

app.set('view engine', "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(require('express-session')({
  secret: "This is a secret encoded message",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(process.env.MONGODB_URI)

//User Schema
var userSchema = new mongoose.Schema({
  username: String,
  password: String
})

userSchema.plugin(passportLocalMongoose)
var User = mongoose.model("User", userSchema)

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

User.register(new User({username: 'stylianos'}), 'MySecretBlogPassword123@', function(err, user) {
  if (err) {
    console.log(err)
  } 
})

//Index Routes
app.get('/', function(req,res) {
  res.render("home")
})

app.get('/about', function(req,res) {
  res.render('about')
})

app.get('/projects', function(req,res) {
  proj.find({}, function(err, projects) {
    if(err) {
      console.log(err)
    } else {
      res.render('projects', {projects:projects})
    }
  })
})

app.get('/compsci', function(req,res) {
  cBlog.find({}, function(err, cblog) {
    if(err) {
      console.log(err)
    } else {
      res.render('compsci', {cblog:cblog})
    }
  })
})

app.get('/sportsci', function(req,res) {
  sBlog.find({}, function(err, sblog) {
    if(err) {
      console.log(err) 
    } else {
      res.render('sportsci', {sblog:sblog})
    }
  })
})

app.get('/login', function(req,res) {
  res.render('login')
})

app.post('/login',passport.authenticate('local', {
  successRedirect: "/admin",
  failureRedirect: '/'
}), function(req,res) {
})

app.get('/logout', function(req,res) {
  req.logout() 
  res.redirect('/')
})


//SHOW Route
app.get('/compsci/:id', function(req,res) {
  cBlog.findById(req.params.id, function(err, blog) {
    if(err) {
      res.redirect('/')
    } else {
      res.render('cshow',{blog:blog})
      console.log(blog)
    }
  })
})

app.get('/sportsci/:id', function(req,res) {
  sBlog.findById(req.params.id, function(err, blog) {
    if(err) {
      res.redirect('/')
    } else {
      res.render('sshow',{blog:blog})
      console.log(blog)
    }
  })
}) 

//Admin INDEX
app.get('/admin', isLoggedIn, function(req,res) {
  res.render('admin')
})

//Admin Read
app.get('/admin/compsci', isLoggedIn, function(req,res) {
  cBlog.find({}, function(err, cblog) {
    if(err) {
      console.log(err)
    } else {
      res.render('acompsci', {cblog:cblog})
    }
  })
})

app.get('/admin/sportsci', isLoggedIn, function(req,res) {
  sBlog.find({}, function(err, sblog) {
    if(err) {
      console.log(err)
    } else {
      res.render('asportsci', {sblog:sblog})
    }
  })
})

//Create
app.get('/admin/compsci/new',isLoggedIn, function (req,res) {
  res.render('cnew')
 })

app.get('/admin/sportsci/new',isLoggedIn, function (req,res) {
  res.render('snew')
})


//SHOW
app.get('/admin/compsci/:id',isLoggedIn, function(req,res) {
  cBlog.findById(req.params.id, function(err, blog) {
    if(err) {
      res.redirect('/')
    } else {
      res.render('acshow',{blog:blog})
      console.log(blog)
    }
  })
})

app.get('/admin/sportsci/:id',isLoggedIn, function(req,res) {
  sBlog.findById(req.params.id, function(err, blog) {
    if(err) {
      res.redirect('/')
    } else {
      res.render('asshow',{blog:blog})
      console.log(blog)
    }
  })
}) 


app.post('/admin/compsci',isLoggedIn, function(req,res) {
  cBlog.create(req.body.cblog, function(err, blog) {
    if(err) {
      console.log(err)
    } else {
      console.log("blog created")
      res.redirect('/admin/compsci')
    }
  })
})

app.post('/admin/sportsci', isLoggedIn, function(req,res) {
  sBlog.create(req.body.sblog, function(err, blog) {
    if(err) {
      console.log(err)
    } else {
      console.log("blog created")
      res.redirect('/admin/sportsci')
    }
  })
})

//Edit //Update

app.get('/admin/compsci/:id/edit',isLoggedIn, function(req,res) {
  cBlog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      console.log(err)
    } else {
      res.render('cedit', {foundBlog:foundBlog})
    }
  })
})

app.get('/admin/sportsci/:id/edit',isLoggedIn, function(req,res) {
  sBlog.findById(req.params.id, function(err, foundBlog) {
    if(err) {
      console.log(err)
    } else {
      res.render('sedit', {foundBlog:foundBlog})
    }
  })
})

app.put('/admin/compsci/:id',isLoggedIn, function(req,res) {
  cBlog.findByIdAndUpdate(req.params.id, req.body.cblog, function(err, updatedBlog) {
    if(err) {
      console.log(err)
    } else {
      console.log(updatedBlog)
      res.redirect('/admin/compsci/' + req.params.id)
      console.log('updated blog!')
    }
  })
})

app.put('/admin/sportsci/:id',isLoggedIn, function(req,res) {
  sBlog.findByIdAndUpdate(req.params.id, req.body.sblog, function(err, updatedBlog) {
    if(err) {
      console.log(err)
    } else {
      console.log(updatedBlog)
      res.redirect('/admin/sportsci/' + req.params.id)
      console.log('updated blog!')
    }
  })
})

//Delete

app.delete('/admin/compsci/:id',isLoggedIn, function(req,res) {
  cBlog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err)
    } else {
      console.log('Deleted')
      res.redirect('/compsci')
    }
  })
})

app.delete('/admin/sportsci/:id',isLoggedIn, function(req,res) {
  sBlog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err)
    } else {
      console.log('Deleted')
      res.redirect('/sportsci')
    }
  })
})

//Middleware
function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()) {
    return next()
  }
  return res.redirect('/login')
}

//LISTEN
app.listen(PORT, function() {
  console.log('The Server is Started!')
})

