const Listing = require("../models/listing.js");
// const Property = require("../models/property.js");

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{ // add /listings/new before /listings/:id
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data or listing");
    }
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success","new listing created!");
    res.redirect("/listings");
}

module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    req.flash("success","listing edited!");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    }
    await listing.save();
    req.flash("success","listing updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
}

module.exports.search = async (req, res) => {
    const searchTerm = req.query.location?.trim() || '';

    // console.log(searchTerm);
    try {
        const properties = await Listing.find({
            $or: [
                { location: { $regex: searchTerm, $options: 'i' } },
                { country: { $regex: searchTerm, $options: 'i' } }
            ]
        }).populate({
            path: 'reviews',
            populate: { path: 'author', select: 'username' }
        });
        res.render('listings/searchResults.ejs', { properties, searchTerm });
    } catch (error) {
        res.status(500).send('Error searching properties');
    }
};
