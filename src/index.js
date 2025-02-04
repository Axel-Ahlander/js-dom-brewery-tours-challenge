async function fetchBreweries(state) {
    const response = await fetch(`https://api.openbrewerydb.org/breweries?by_state=${state}`);
    const data = await response.json();
    let breweries = [];

    for (let i = 0; i < data.length; i++) {
        if (data[i].brewery_type == 'micro' || data[i].brewery_type == 'regional' || data[i].brewery_type == 'brewpub') {
            breweries.push(data[i]);
        }
    }

    return breweries;
}

async function fetchBreweriesByName(name) {
    const response = await fetch(`https://api.openbrewerydb.org/breweries?by_name=${name}`);
    const data = await response.json();
    let breweries = [];

    for (let i = 0; i < data.length; i++) {
        if ((data[i].brewery_type == 'micro' || data[i].brewery_type == 'regional' || data[i].brewery_type == 'brewpub') && (data[i].name.toLowerCase().includes(name.toLowerCase()))) {
            breweries.push(data[i]);
        }
    }



    return breweries;
}
async function GetBreweriesByTour() {
    let acstate = document.getElementById('select-state').value.trim();
    let acname = document.getElementById('select-company').value.trim();
    let breweries = [];

    
    if (acstate) {
        breweries = await fetchBreweries(acstate);
    }

    
    if (acname) {
        const breweriesByName = await fetchBreweriesByName(acname);
        if (acstate) {
            let matchedBreweries = [];
            for (let i = 0; i < breweries.length; i++) {
                for (let j = 0; j < breweriesByName.length; j++) {
                    if (breweries[i].id === breweriesByName[j].id) {
                        matchedBreweries.push(breweries[i]);
                    }
                }
            }
            breweries = matchedBreweries;
        } else {
            breweries = breweriesByName;
        }
    }


    let brew = document.getElementById('filter-by-type');
    let allBreweries = document.getElementById('breweries-list');
   
    
    allBreweries.innerHTML = "";

    for (let i = 0; i < breweries.length; i++){
        if (breweries[i].brewery_type == brew.value){
            let selectedBreweries = document.createElement('li');
            //name
            let name = document.createElement('h2');
            name.innerHTML = breweries[i].name;
            selectedBreweries.append(name);

            //type
            let type = document.createElement('div');
            type.classList.add('type');
            type.innerHTML = breweries[i].brewery_type;
            selectedBreweries.append(type);


            //address
            let address = document.createElement('section');
            address.classList.add('address');
            let addresse = document.createElement('h3');
            addresse.innerHTML = 'Address:';
            address.append(addresse);
            let addressname = document.createElement('p');
            addressname.innerHTML = breweries[i].street;
            let postal = document.createElement('p');
            let pos = document.createElement('strong');
            pos.innerHTML = `${breweries[i].city}, ${breweries[i].street}`;
            postal.append(pos);
            address.append(addresse);
            address.append(addressname);
            address.append(postal);
            selectedBreweries.append(address);

            //phone
            let phone = document.createElement('section');
            phone.classList.add('phone');
            let title = document.createElement('h3');
            title.innerHTML = 'Phone:'
            let number = document.createElement('p');
            number.innerHTML = `${breweries[i].phone}`;
            phone.append(title);
            phone.append(number);
            selectedBreweries.append(phone);

            //link
            let link = document.createElement('section');
            link.classList.add('link');
            let actualLink = document.createElement('a');
            actualLink.href = breweries[i].website_url;
            actualLink.target = '_blank';
            actualLink.innerHTML = 'Visit Website';
            link.append(actualLink);
            selectedBreweries.append(link);

            allBreweries.append(selectedBreweries);
            
            
        }
    }
}




document.getElementById('select-state-form').addEventListener('submit', (event) => {
    event.preventDefault();
    GetBreweriesByTour();
});

document.getElementById('filter-by-type').addEventListener('change', GetBreweriesByTour);

document.getElementById('filter-by-type').addEventListener('change', GetBreweriesByTour);


document.getElementById('select-company').addEventListener('input', () => {
    GetBreweriesByTour();
});