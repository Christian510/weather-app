
exports.get404 = (req, res, next) => {
    res.status(404).render('error/404', {
        title: "Page Not Found!", 
        path: "/404", 
        message: ""
    });
}

exports.get500 = (req, res, next) => {
    res.status(500).render('error/500', {
        title: "Page Not Found!", 
        path: "/500",
        message: ''
    });
}