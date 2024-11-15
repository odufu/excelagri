const express = require('express');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
const brandRoute = require('./routes/brand.route');
const productRoute = require('./routes/product.route');
const cartegoryRoute = require('./routes/cartegory.route');
const globalHandler = require('./controllers/error.controller');
const xss = require('xss-clean');
const path = require('path');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

const app = express();

app.use(
  session({
    secret: 'Poll', 
    resave: false,
    saveUninitialized: true,
  })
);


app.use(
  cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    origin: '*',
    credentials: true,
  })
);


app.use(helmet());

// Limit requests from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!'
// });
// app.use('/api', limiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));

app.use(express.urlencoded({ extended: true }));

// Data sanitization against XSS
app.use(xss());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1/auth', authRoute);

app.use('/api/v1/user', userRoute);

app.use('/api/v1/brand', brandRoute);

app.use('/api/v1/product', productRoute);
app.use('/api/v1/cartegory', cartegoryRoute);


app.use(globalHandler);

app.get('/', (req, res) => {
  res.send(' Server live ⚡️');
});

app.all('*', (req, res, next) => {
  res.status(404).json({
    success: false,
    messsage: `${req.originalUrl} not found`,
  });
});

module.exports = app;