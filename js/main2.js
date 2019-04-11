var app = new Vue({
    el: '#app',
    data: {
        searchProjects: [],
        nextprojID: "&nextProjectId=23",
        view: "home",
        selectedProj: {},
        selectedCountry: '',
        selectedTheme: '',
        basket: [],
        history: [],
        pageIndex: 0,
       

    },
    methods: {
       

        getItems: function () {

            var url = "https://api.globalgiving.org/api/public/projectservice/all/projects/active.json?api_key=f532b2d3-9dc1-428c-9f46-148656571409";
        
            var newurl = url + this.nextprojID;
        
            let req = new Request(newurl, {
                
            });
            fetch(req)
            .then(function (response) {
                return response.json();
                
            }).then(function (data) {
                // console.log(data);   
                // console.log(history)
                
                
                for(let i=0; i < data.projects.project.length; i++){
                    data.projects.project[i].quantity=0;
                }
                //ok so i added this pageIndex yesterday that is saving the current page visited. basically "next" add 1 and "back" is minus 1 on the index
                app.pageIndex++
                
                console.log(app.pageIndex);
                
                //so i use app.pageIndex and check if the current page is the last one, in which case i proceed to fetch new data and asign the next project id
                //THIS NEEDS TO BE REFACTORED! the fetch should be inside the IF and not the other way around so this way if you go forward on a page that already
                //has been loaded, you dont fetch and thus you dont query the API and avoid using promises
                if (app.pageIndex == (app.history.length+1)) {
                    
        
                    app.nextprojID = "&nextProjectId=" + data.projects.nextProjectId
                    //here instead of saving the proyect IDs i save the entire project object as a new entry in the array History
                    app.history.push(data.projects.project);
                    
                    // console.log(app.nextprojID);
                    // console.log(app.history[0]);
                    
                    
                    // console.log(app.history[app.history.length-1]);
                    
                    // console.log(app.history.length);
                    // console.log(app.pageIndex == app.history.length);
        
                    //then asign searchProjects to the latest entry in the array
                    app.searchProjects = app.history[app.history.length-1]
                    console.log(app.searchProjects)
                } else {
        
                    //If the current pageIndex is not the latest page, we save the corresponding entry from the history into searchProjects
                    //the back button is basically the same but reverse and without the fetch bit
                    app.searchProjects = app.history[app.pageIndex-1]
                }
                 
                    
            })
                .catch(function (error) {
                    // alert("error")
                    console.log("error", error);
                });
            //end of fetch
        
        }, //end of method getItems 
        
        getHistory(){

            app.pageIndex--
            app.searchProjects = app.history[app.pageIndex-1]
            console.log(app.pageIndex);
            console.log(app.history.length);
            
            
        },


        goDetail: function (project) {
            this.selectedProj = project;
        },
        addtoBasket: function (selected) {
            var found = false;
            this.basket.forEach(proj => {
                if (selected.id === proj.id) {
                    found = true;
                    proj.quantity++;
                }
            })
            if (found === false) {
                selected.quantity = 1;
                this.basket.push(selected);
            }

        },
        removefromBasket: function (selected) {
            // selected.quantity -= 1;
            // this.basket.splice(this.basket.indexOf(selected.id), 1);//this takes the whole project out of the basket 
            //rather than one portion/donation amount
        
            var found = false;
            this.basket.forEach(proj => {
                if (selected.id === proj.id) {
                    found = true;
                    proj.quantity--;
                }
            })
            if (found === false) {
                selected.quantity = -1;
                this.basket.push(selected);
            }
        }
       
    }, //end of methods
    created() {
        console.log("mounted!");

        this.getItems()

    }, //end of created
    computed: {
        getBasket() {
            return this.basket
        },
        filterProjects() {
            return this.searchProjects

                .filter((project) => {

                    return project.country.match(this.selectedCountry) || this.selectedCountry == 'all'

                })
                .filter((project) => {
                    return project.themeName.match(this.selectedTheme) || this.selectedTheme == 'all'
                })

        },
        subtotal(){

            return this.basket.reduce((x,y)=> 
            x+y.donationOptions.donationOption[0].amount * y.quantity, 0)
        },
        total() {
            var total =0;
            for (var i = 0; i < this.basket.length; i++){ 
            total += this.basket[i].donationOptions.donationOption[0].amount * this.basket[i].quantity;
                };
                 // get 10% discount when you donate to more than 5 projects  
                if (this.basket.length >= 3) {
                    let discount = total * 0.1;
                    total = total - discount;
                };  return total;
            }, 
        free(){
                this.basket.sort((a,b)=>{
                    return b.donationOptions.donationOption[0].amount - a.donationOptions.donationOption[0].amount;
                })
                console.log('sorted: ', this.basket)
            
                if (this.basket.length >=4){
                    alert ("i am 4+ projects");
                    this.basket[this.basket.length-1].quantity -= 1;
                }         
            } 
      
       
    }
});


$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})





