module.exports = function(req, res, next){
    if (req.method == "OPTIONS") {
        next();
    } else{
        req.user.getProfiles().then( (profiles) => { 
            if( profiles[0].id ){
                req.mainProfileId = profiles[0].id;
                next();
            } else{ 
                console.log("No profiles found for user!"); 
                next(); 
            }
        });
    }
};