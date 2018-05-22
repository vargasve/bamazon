var mysql = require("mysql"),
    inquirer = require("inquirer");

var connection = mysql.createConnection({
  host:"localhost",
  port: 3306,
  user:"root",
  password: "",
  database: "bamazon"
});

var totalCost = 0;

connection.connect(function(err){
  if (err) throw err;
  console.log("connected as id: " + connection.threadId)
  productList();
});

function productList() {
  var query = connection.query(
      "SELECT * FROM forSale", function(err, res){
        if(err) throw err;
        console.log(res);
        selectItem();
  });
};

function selectItem() {
  connection.query("SELECT * FROM forSale", function(err, res){
  if(err) throw err;

  inquirer.prompt([
  {
    name: "id",
    type: "input",
    message: "What is the ID of the product you would like to purchase?",
    
    validate: function(val) {
      if (isNaN(val) === false) {
        return true;
      }
      console.log("\n" + "Please enter a number between 1 and " + res.length);
      return false
    }
  },
  {
    name: "quantity",
    type: "input",
    message: "How many do you want to purchase?",
    
    validate: function(val) {
      if (isNaN(val) === false) {
        return true;
      }
      return false
    }
  }
  ]).then(function(answer) {
      var chosenItem = '';
      var found = false;
      var inStock = false;
      var stock = 0;

      console.log(stock);

      for(var i=0; i < res.length; i++){
        if(res[i].id === parseInt(answer.id) && res[i].stock >= answer.quantity){
          found = true;
          inStock = true;
          chosenItem = res[i];
          stock = res[i].stock;
        } else if (res[i].id === parseInt(answer.id) && res[i].stock < answer.quantity) {
          found = true;
          inStock = false;
          chosenItem = res[i];
          stock = res[i].stock;
        };
      };
  
      if(found === true && inStock === true){
        connection.query(
         "UPDATE forSale SET ? WHERE ?",
         [
          {
            stock: chosenItem.stock - answer.quantity
           },
          {
           id: chosenItem.id
          }
         ],
        );
        var cost = chosenItem.price * answer.quantity;
        totalCost += cost;

        console.log("You have purchased " + answer.quantity + " " + chosenItem.product + " for $" + cost + ". Your current total is $" + totalCost + ".");


      } else if(found === true && inStock === false && stock > 0) {
        console.log("There are " + stock + " " + chosenItem.product + "s. Don't be selfish.");
      } else if(found === true && inStock === false && stock < 1){
        console.log("More of " + chosenItem.product + " will be available soon.");
      }
      else {
        console.log("The ID number that you have entered does not exist. Enter an ID between 1 and " + res.length + ".");
      }

      inquirer.prompt([
        {
          name: "continue",
          type: "list",
          message: "Do you want to buy something else?",
          choices: ["Yes, I want to keep shopping.", "No, I am done."]
        }
      ]).then(function(answer){
        var buyMore = false;
        if(answer.continue === "Yes, I want to keep shopping.") {
          buyMore = true;
        }

        if(buyMore) {
          console.log("You have spent $" + totalCost + ".");
          selectItem();
        }
        else {
          console.log("You have spent $" + totalCost + ".");
          connection.end();
        }

      });

   });
 });


 };