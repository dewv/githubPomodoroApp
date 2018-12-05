/** MVC model for the "pomodoro" service. 
 * @module services/pomodoro/Pomodoro
 */

"use strict";

let Model = require("../../mmvece/Model");

/** Models the data and behavior of a pomodoro work record.
 * @argument {number} id - A unique ID number for this pomodoro.
 * @argument {Object} properties - An object containing values for this element's properties.
 */
class Pomodoro extends Model {
    constructor(id, properties) {
        super();

        /** @property {number} */
        this.id = id;

        // TODO define other properties 
        
        // If `properties` is undefined, make it an empty object.
        properties = properties || {};

        // Copy all property valules into this object.
        for (let property in properties) {
            this[property] = properties[property];
        }
    }

    /** Reads all pomodoros that the current user can access. 
     * @argument {Function} callback A function to be called when this async operation completes.
     */
    static readAll(callback) {
        Model.readAll(Pomodoro, callback);
    }

    // TODO figure out which operations are supported
    // /** @override */
    // static whyNotList(context, callback) {
    //     callback(["Because I said so.", "Also, I hate you."]);
    // }
    whyNotDelete() {
        return ["This operation is not supported."];
    }
}

Pomodoro.dbBinding = {
    // TODO figure out database structure
    mainTable: {
        db: "githubPomodoro", // name of database where table is located
        name: "pomodoro", // name of main table that stores data for this class
        key: { // we assume there is a single column primary key
            property: "id", // name of the JS object property
            column: "pk" // name of the db table column
        },
        data: [ // set of non-key fields
            {
                property: "", // name of the JS object property
                column: "", // name of the db table (main table) column; the FK
                columnType: "", // MySQL column definition
                lookup: { // the value for this internal ID sorta field is determined by user-friendly value in a different property of this JS object
                    table: "", // name of the table that defines valid values for this property 
                    sql: "", // query to get internal id for user-friendly property value 
                    column: "", // the db column that contains the internal id 
                    xref: "" // name of the property with user-friendly value
                }
            }
        ]
    },
    otherTables: [ // set of other tables that store data for this class
        {
            db: "githubPomodoro", // name of database where table is located
            name: "", // table name
            key: { // we assume there is a single column primary key
                column: "" // name of the db table column
            },
            data: [ // set of non-key fields
                {
                    property: "", // name of the JS object property
                    column: "", // name of the db table column
                    columnType: "", // MySQL column definition
                    domain: "" // query to get all possible lookup values from table; used for form selection lists
                }
            ],
            joinColumn: "", // name of the foreign key column in the main table
            insert: ""
        }
    ]
};

Pomodoro.serviceConfig = {
    baseUrl: "pomodoro",
    modelClass: Pomodoro
};
Model.setupService(Pomodoro.serviceConfig);

Model._createTables(Pomodoro.dbBinding);

module.exports = Pomodoro;
