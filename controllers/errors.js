
exports.get404 = (req, res, next) => {
    res.status(404).render('error/404', {
        title: "Page Not Found!", 
        path: "/404"
    });
}