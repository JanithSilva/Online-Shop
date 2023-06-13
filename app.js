const path = require('path');
const express = require('express');
const csrf = require('csurf');
const expressSession  = require('express-session');

const db = require('./data/database');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');

const CSRFTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/chekAuth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const updateCartPricesMiddleware = require('./middlewares/update-cart-prices');
const notFoundMiddleware = require('./middlewares/not-found');

const createSessionConfig = require('./config/session');



const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/products/assets', express.static('product-data'));
app.use(express.urlencoded({extended : false}));
app.use(express.json());

const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(csrf());


app.use(CSRFTokenMiddleware);
app.use(checkAuthStatusMiddleware);
app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);


app.use(authRoutes);
app.use(baseRoutes);
app.use(productRoutes);
app.use('/cart', cartRoutes);


app.use('/admin', protectRoutesMiddleware, adminRoutes);
app.use('/orders', protectRoutesMiddleware, orderRoutes);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

db.connectToDatabse().
    then(function () {
        app.listen(3000);
    })
    .catch(function (error) {
        console.log('Failed to connect to database');
        console.log(error);
    });

