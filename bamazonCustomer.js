var mysql = require("mysql");
var inquirer = require("inquirer");
// var table = require("cli-table");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "Bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});



function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all res of the SELECT statement
        console.table(res);
             inquirer
            .prompt([{
                name: "id",
                type: "input",
                message: "What is the id of the item you wish to buy?"
            },
            {
                name: "units",
                type: "input",
                message: "How much of the item do you wish to buy?"
            }

            ])
            .then(function(answer) {
                // get the information of the chosen item
                 for (var i = 0; i < res.length; i++) {
                 if (res[i].id == answer.id) {
                     if(res[i].stock_quantity >= answer.units) {
                        console.log("Your total cost is " + answer.units * res[i].price);
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                              {
                                stock_quantity: res[i].stock_quantity - answer.units
                              },
                              {
                                  id: answer.id
                              }                              
                            ],
                            function(error) {
                              if (error) throw err;
                              start();
                            }
                          );
                     } else{console.log("not enough quantity available, please select another amount");
                     start();                    }
                  }
                }
            })
            })
        };                