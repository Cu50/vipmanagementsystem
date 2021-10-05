/* 
app.get("/food/:id",(req,res) => {
    const found = food.some(food => food.id === parseInt(req.params.id));
    if(found) {
        res.json(food.fliter(food => food.id === parseInt(req.params.id)));
    }
    else {
        res.status(400).json({msg:`No number ${req.params.id}`})
    }
}) */