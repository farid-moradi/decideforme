let main_nav = document.querySelector("#main-nav");
let pagesClass = document.querySelector('#pages-class');
let tabNumber = 1;
let tabNumberNMOS = 1;
let tabNumberPMOS = 1;
let tabNumberResistor = 1;
let tabNumberInductor = 1;
let tabNumberCapacitor = 1;
let activeTabID = 0;
let subNumberP = [1, 2, 3, 4];
let subNumberN = [1, 2, 3, 4];
let transistorContents = [];
let maxId = 1000;

function debug() {
  console.log('tabNumber', tabNumber)
  console.log('tabNumberNMOS', tabNumberNMOS)
  console.log('tabNumberPMOS', tabNumberPMOS)
  console.log('tabNumberResistor', tabNumberResistor)
  console.log('tabNumberInductor', tabNumberInductor)
  console.log('tabNumberCapacitor', tabNumberCapacitor)
  console.log('activeTabID', activeTabID)
  console.log('transistorContents', transistorContents)
  console.log('listMapList', listMapList)
  console.log('idID', idID)
}

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 's') {
    // Prevent the Save dialog to open
    e.preventDefault();
    makesaved();
    let response = {};
    for (let i = 0; i < transistorContents.length; i++) {
      response[`transistor${i}`] = {};
      response[`transistor${i}`]['data'] = transistorContents[i]['data'];
      response[`transistor${i}`]['degreeFreedom'] = transistorContents[i]['degreeFreedom'];
      response[`transistor${i}`]['primaryCalculation'] = transistorContents[i]['primaryCalculation'];
      response[`transistor${i}`]['specification'] = transistorContents[i]['specification'];
      response[`transistor${i}`]['tech'] = transistorContents[i]['tech'];
      response[`transistor${i}`]['subsymbol'] = transistorContents[i]['subsymbol'];
      response[`transistor${i}`]['tabName'] = transistorContents[i]['tabName'];
      response[`transistor${i}`]['id'] = transistorContents[i]['id'];
      response[`transistor${i}`]['type'] = transistorContents[i]['type'];
      response[`transistor${i}`]['technology'] = transistorContents[i]['technology'];
    }
    postRequest('http://localhost:3000/savedata', response);
  }
});

// this will avoid refreshing
// console.log(window.performance.navigation.type)

document.addEventListener('DOMContentLoaded', (event) => {
  // postRequest('http://localhost:3000/projectname', 'undefined');
  initialization();
    tabNumber = 1;
    tabNumberNMOS = 1;
    tabNumberPMOS = 1;
    tabNumberResistor = 1;
    tabNumberInductor = 1;
    tabNumberCapacitor = 1;
    activeTabID = 0;
    transistorContents = [];
    listMapList = [];
    maxId = 1000;


    let tabItem1 = document.querySelector("#new-tab");
    tabItem1.innerHTML = '<a class="nav-link dropdown-toggle small" aria-current="page" href="#" data-toggle="dropdown"><span class="text-dark" id="tab-name">new</span></a><div class="dropdown-menu small" aria-labelledby="first-page-tab"><a class="dropdown-item small" href="#" id="nmos">NMOS</a><a class="dropdown-item small" href="#" id="pmos">PMOS</a><a class="dropdown-item small" href="#" id="resistor">Resistor</a><a class="dropdown-item small" href="#" id="inductor">Inductor</a><a class="dropdown-item small" href="#" id="capacitor">Capacitor</a></div>'
    let delelem = main_nav.querySelectorAll('li');
    for (let i = 0; i < delelem.length - 1; i++) {
      main_nav.removeChild(delelem[i]);
    }
    main_nav.appendChild(tabItem1);
    tabItem1.addEventListener('click', function() {
    });

    clearMainArea();

    let pnametext = document.querySelector('#project-name');

    let nmos = document.querySelector("#nmos");
    let pmos = document.querySelector("#pmos");
    let resistor = document.querySelector("#resistor");
    let inductor = document.querySelector("#inductor");
    let capacitor = document.querySelector("#capacitor");
    pmos.addEventListener('click', function() {
      makeunsaved();
      createTransistor('pmos', '180', false);
    });
    nmos.addEventListener('click', function() {
      makeunsaved();
      createTransistor('nmos', '180', false);
    });
    resistor.addEventListener('click', function() {
      makeunsaved();
      createTransistor('resistor', '180', false);
    });
    inductor.addEventListener('click', function() {
      makeunsaved();
      createTransistor('inductor', '180', false);
    });
    capacitor.addEventListener('click', function() {
      makeunsaved();
      createTransistor('capacitor', '180', false);
    });

        fetch('http://localhost:3000/getpname')
          .then(response => response.json())
          .then(data => {
            let url = `http://localhost:3000/opendata/${data['pname']}`;
            pnametext.innerHTML = data['pname'];
            fetch(url)
              .then(response => response.json())
              .then(response => {
                let i = 0;
                for (const [key, value] of Object.entries(response)) {
                  transistorContents[i] = {};
                  let type = transistorContents[i]['type'];
                  transistorContents[i]['data'] = response[key]['data'];
                  transistorContents[i]['degreeFreedom'] = response[key]['degreeFreedom'];
                  transistorContents[i]['primaryCalculation'] = response[key]['primaryCalculation'];
                  transistorContents[i]['specification'] = response[key]['specification'];
                  transistorContents[i]['technology'] = response[key]['technology'];
                  transistorContents[i]['tech'] = response[key]['tech'];
                  transistorContents[i]['subsymbol'] = response[key]['subsymbol'];
                  transistorContents[i]['tabName'] = response[key]['tabName'];
                  transistorContents[i]['id'] = parseInt(response[key]['id']);
                  if (transistorContents[i]['id'] > maxId) {
                    maxId = transistorContents[i]['id'];
                  }
                  transistorContents[i]['type'] = response[key]['type'];
                  i++;
                }
                for (let j = 0; j < transistorContents.length; j++) {
                  let type = transistorContents[j]['type'];
                  if (findIndex(transistorContents[j]['id']) != -1) {
                    updateIndex(transistorContents[j]['id'], j);
                  } else {
                    listMapList.push({'id': transistorContents[j]['id'], 'index': tabNumber-1});
                  }
                  tabNumber++;
                  idID++;
                  switch(type) {
                    case 'nmos':
                      tabNumberNMOS++;
                      break;
                    case 'pmos':
                      tabNumberPMOS++;
                      break;
                    case 'resistor':
                      tabNumberResistor++;
                      break;
                    case 'inductor':
                      tabNumberInductor++;
                      break;
                    case 'capacitor':
                      tabNumberCapacitor++;
                      break;
                  }
                  if (type == 'nmos' || type == 'pmos') {
                    createTransistorTab(transistorContents[j]['id'], transistorContents[j]['type'], transistorContents[j]['technology']);
                    calculateProcesses(transistorContents[j]['id'], transistorContents[j]['type'], transistorContents[j]['technology']);
                  } else {
                    createRICTab(transistorContents[j]['id'], transistorContents[j]['type']);
                  }
                }
                idID = maxId + 1;
              })
          });
});

function postRequest(urlPath, uploadData) {
  $.ajax({
    type: 'post',
    url: urlPath,
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    data: uploadData,
    xhrFields: {
        withCredentials: false
    },  
    headers: {
  
    }, 
    success: function (data) {
        console.log('Success');
    },  
    error: function () {
        console.log('We are sorry but our servers are having an issue right now');
    }
  });
}

function makeunsaved() {
  let pname = document.querySelector("#project-name");
  pname.style.fontStyle = "italic";
  if ((pname.innerHTML)[pname.innerHTML.length-1] != '*')
    pname.innerHTML += '*';
}

function makesaved() {
  let pname = document.querySelector("#project-name");
  if ((pname.innerHTML)[pname.innerHTML.length-1] == '*') {
    pname.style.fontStyle = "normal";
    pname.innerHTML = pname.innerHTML.slice(0, pname.innerHTML.length-1);
  }
}

function initialization() {  
  // building the first new tab
  let tabItem1 = document.createElement("li");
  tabItem1.className = "nav-item dropdown";
  // This shouldn't be deleted because the color of the page might not be decided as white
  // tabItem1.style.backgroundColor = "hsl(206deg 100% 97%)";
  tabItem1.style.backgroundColor = "white";
  tabItem1.id = "new-tab";
  tabItem1.innerHTML = '<a class="nav-link dropdown-toggle small" aria-current="page" href="#" data-toggle="dropdown"><span class="text-dark" id="tab-name">new</span></a><div class="dropdown-menu small" aria-labelledby="first-page-tab"><a class="dropdown-item small" href="#" id="nmos">NMOS</a><a class="dropdown-item small" href="#" id="pmos">PMOS</a><a class="dropdown-item small" href="#" id="resistor">Resistor</a><a class="dropdown-item small" href="#" id="inductor">Inductor</a><a class="dropdown-item small" href="#" id="capacitor">Capacitor</a></div>'
  main_nav.appendChild(tabItem1);
  tabItem1.addEventListener('click', function() {
  });
  
  let nmos = document.querySelector("#nmos");
  let pmos = document.querySelector("#pmos");
  let resistor = document.querySelector("#resistor");
  let inductor = document.querySelector("#inductor");
  let capacitor = document.querySelector("#capacitor");
  pmos.addEventListener('click', function() {
    makeunsaved();
    createTransistor('pmos', '180', false);
  });
  nmos.addEventListener('click', function() {
    makeunsaved();
    createTransistor('nmos', '180', false);
  });
  resistor.addEventListener('click', function() {
    makeunsaved();
    createTransistor('resistor', '180', false);
  });
  inductor.addEventListener('click', function() {
    makeunsaved();
    createTransistor('inductor', '180', false);
  });
  capacitor.addEventListener('click', function() {
    makeunsaved();
    createTransistor('capacitor', '180', false);
  });

  
  let close = document.querySelector('#close');
  close.addEventListener('click', function() {
    let response = {};
    for (let i = 0; i < transistorContents.length; i++) {
      response[`transistor${i}`] = {};
      response[`transistor${i}`]['data'] = transistorContents[i]['data'];
      response[`transistor${i}`]['degreeFreedom'] = transistorContents[i]['degreeFreedom'];
      response[`transistor${i}`]['primaryCalculation'] = transistorContents[i]['primaryCalculation'];
      response[`transistor${i}`]['specification'] = transistorContents[i]['specification'];
      response[`transistor${i}`]['tech'] = transistorContents[i]['tech'];
      response[`transistor${i}`]['subsymbol'] = transistorContents[i]['subsymbol'];
      response[`transistor${i}`]['tabName'] = transistorContents[i]['tabName'];
      response[`transistor${i}`]['id'] = transistorContents[i]['id'];
      response[`transistor${i}`]['type'] = transistorContents[i]['type'];
      response[`transistor${i}`]['technology'] = transistorContents[i]['technology'];
    }
    postRequest('http://localhost:3000/savedata', response);
    setTimeout(function() {
      // I should find a way to close the window 
      alert('please close the tab to exit successfully!');
    }, 300);
  })

  // export as csv files
  let csvexport = document.querySelector('#exportcsv');
  csvexport.addEventListener('click', function() {
    fetch('http://localhost:3000/getpname')
          .then(response => response.json())
          .then(data => {
            let output = 'EKV Model Base Analog CMOS Design PreSpice Tool';
            output = output.concat(`\n\n\nProject name: ${data['pname']}\n`);
            for(const [index, transistor] of transistorContents.entries()) {
              output = output.concat(`Transistor ${index}: ${transistor['tabName']}\n`);
              output = output.concat(`Type: ${transistor['type']}\n`);
              output = output.concat(`Technology: ${transistor['tech']}\n\n`);
              output = output.concat(`Process Parameters:\n`);
              for(const [key, value] of Object.entries(transistor['data'])) {
                output = output.concat(`,${key},${value['value']}\n`);
              }
              output = output.concat(`Degrees of Freedom:\n`);
              for(const [key, value] of Object.entries(transistor['degreeFreedom'])) {
                output = output.concat(`,${key},${value['value']}\n`);
              }

              output = output.concat(`Primary Calculations:\n`);
              for(const [key, value] of Object.entries(transistor['primaryCalculation'])) {
                output = output.concat(`,${key},${value}\n`);
              }
              output = output.concat(`specifications:\n`);
              for(const [key, value] of Object.entries(transistor['specification'])) {
                output = output.concat(`,${key},${value}\n`);
              }


            }
            // console.log(output)
            download(output, `${data['pname']}.csv`, 'text/plain');
          });
  })

  // circuit analysis event handler
  let circuit = document.querySelector('#circuit-menu');
  circuit.addEventListener('click', function() {
    // shouldn't be removed
    /*if (transistorContents.length == 0) {
      alert("Define and Select a Transistor, Please!");
      return;
    }*/

    let response = {};
    for (let i = 0; i < transistorContents.length; i++) {
      response[`transistor${i}`] = {};
      response[`transistor${i}`]['data'] = transistorContents[i]['data'];
      response[`transistor${i}`]['degreeFreedom'] = transistorContents[i]['degreeFreedom'];
      response[`transistor${i}`]['primaryCalculation'] = transistorContents[i]['primaryCalculation'];
      response[`transistor${i}`]['specification'] = transistorContents[i]['specification'];
      response[`transistor${i}`]['tech'] = transistorContents[i]['tech'];
      response[`transistor${i}`]['tabName'] = transistorContents[i]['tabName'];
      response[`transistor${i}`]['id'] = transistorContents[i]['id'];
      response[`transistor${i}`]['type'] = transistorContents[i]['type'];
    }

    postRequest('http://localhost:3000/dataUpload', response);
    
    window.open('http://localhost:3000/circuit', '_blank', 'location=yes,scrollbars=yes, status=yes, fullscreen=yes');
  });

  let state = {
    'tabNumber': 1,
    'tabNumberNMOS': 1,
    'tabNumberPMOS': 1,
    'tabNumberResistor': 1,
    'tabNumberInductor': 1,
    'tabNumberCapacitor': 1,
    'activeTabID': 0,
    'transistorContents': [],
    'listMapList': []
  }

  
  // open event handler
  let openButton = document.querySelector('#open');
  openButton.addEventListener("click", function() {
    tabNumber = 1;
    tabNumberNMOS = 1;
    tabNumberPMOS = 1;
    tabNumberResistor = 1;
    tabNumberInductor = 1;
    tabNumberCapacitor = 1;
    activeTabID = 0;
    transistorContents = [];
    listMapList = [];
    // idID = 1000;
  
    let tabItem1 = document.querySelector("#new-tab");
    tabItem1.innerHTML = '<a class="nav-link dropdown-toggle small" aria-current="page" href="#" data-toggle="dropdown"><span class="text-dark" id="tab-name">new</span></a><div class="dropdown-menu small" aria-labelledby="first-page-tab"><a class="dropdown-item small" href="#" id="nmos">NMOS</a><a class="dropdown-item small" href="#" id="pmos">PMOS</a><a class="dropdown-item small" href="#" id="resistor">Resistor</a><a class="dropdown-item small" href="#" id="inductor">Inductor</a><a class="dropdown-item small" href="#" id="capacitor">Capacitor</a></div>'
    let delelem = main_nav.querySelectorAll('li');
    for (let i = 0; i < delelem.length - 1; i++) {
      main_nav.removeChild(delelem[i]);
    }
    main_nav.appendChild(tabItem1);
    tabItem1.addEventListener('click', function() {
    });

    clearMainArea();

    let nmos = document.querySelector("#nmos");
    let pmos = document.querySelector("#pmos");
    let resistor = document.querySelector("#resistor");
    let inductor = document.querySelector("#inductor");
    let capacitor = document.querySelector("#capacitor");
    pmos.addEventListener('click', function() {
      makeunsaved();
      createTransistor('pmos', '180', false);
    });
    nmos.addEventListener('click', function() {
      makeunsaved();
      createTransistor('nmos', '180', false);
    });
    resistor.addEventListener('click', function() {
      makeunsaved();
      createTransistor('resistor', '180', false);
    });
    inductor.addEventListener('click', function() {
      makeunsaved();
      createTransistor('inductor', '180', false);
    });
    capacitor.addEventListener('click', function() {
      makeunsaved();
      createTransistor('capacitor', '180', false);
    });

    let pnametext = document.querySelector('#project-name');

    let openwin = window.open('http://localhost:3000/projectspage', 'Open', 'location=yes, height=570, width=1000, scrollbars=yes, status=yes');
    let interval = setInterval(function() {
      if (openwin.closed) {
        fetch('http://localhost:3000/getpname')
          .then(response => response.json())
          .then(data => {
            if (data['pname'] == 'undefined' || data['pname'] == pnametext.innerHTML) {
              pnametext.innerHTML = 'undefined';
              postRequest('http://localhost:3000/projectnameprime', 'undefined');
              return;
            }
            clearInterval(interval)
            let url = `http://localhost:3000/opendata/${data['pname']}`;
            pnametext.innerHTML = data['pname'];
            fetch(url)
              .then(response => response.json())
              .then(response => {
                let i = 0;
                for (const [key, value] of Object.entries(response)) {
                  transistorContents[i] = {};
                  let type = transistorContents[i]['type'];
                  transistorContents[i]['data'] = response[key]['data'];
                  transistorContents[i]['degreeFreedom'] = response[key]['degreeFreedom'];
                  transistorContents[i]['primaryCalculation'] = response[key]['primaryCalculation'];
                  transistorContents[i]['specification'] = response[key]['specification'];
                  transistorContents[i]['technology'] = response[key]['technology'];
                  transistorContents[i]['tech'] = response[key]['tech'];
                  transistorContents[i]['subsymbol'] = response[key]['subsymbol'];
                  transistorContents[i]['tabName'] = response[key]['tabName'];
                  transistorContents[i]['id'] = parseInt(response[key]['id']);
                  transistorContents[i]['type'] = response[key]['type'];
                  i++;
                }
                for (let j = 0; j < transistorContents.length; j++) {
                  let type = transistorContents[j]['type'];
                  if (findIndex(transistorContents[j]['id']) != -1) {
                    updateIndex(transistorContents[j]['id'], j);
                  } else {
                    listMapList.push({'id': transistorContents[j]['id'], 'index': tabNumber-1});
                  }
                  tabNumber++;
                  idID++;
                  switch(type) {
                    case 'nmos':
                      tabNumberNMOS++;
                      break;
                    case 'pmos':
                      tabNumberPMOS++;
                      break;
                    case 'resistor':
                      tabNumberResistor++;
                      break;
                    case 'inductor':
                      tabNumberInductor++;
                      break;
                    case 'capacitor':
                      tabNumberCapacitor++;
                      break;
                  }
                  if (type == 'nmos' || type == 'pmos') {
                    createTransistorTab(transistorContents[j]['id'], transistorContents[j]['type'], transistorContents[j]['technology']);
                    calculateProcesses(transistorContents[j]['id'], transistorContents[j]['type'], transistorContents[j]['technology']);
                  } else {
                    createRICTab(transistorContents[j]['id'], transistorContents[j]['type']);
                  }
                }
              })
          });
      }
    }, 1000)
  });

  // create new poject event handler
  let createButton = document.querySelector('#create');
  createButton.addEventListener("click", function() {
    postRequest('http://localhost:3000/projectnameprime', 'undefined');
    tabNumber = 1;
    tabNumberNMOS = 1;
    tabNumberPMOS = 1;
    tabNumberResistor = 1;
    tabNumberInductor = 1;
    tabNumberCapacitor = 1;
    activeTabID = 0;
    transistorContents = [];
    listMapList = [];
    // idID = 1000;
  
    let tabItem1 = document.querySelector("#new-tab");
    tabItem1.innerHTML = '<a class="nav-link dropdown-toggle small" aria-current="page" href="#" data-toggle="dropdown"><span class="text-dark" id="tab-name">new</span></a><div class="dropdown-menu small" aria-labelledby="first-page-tab"><a class="dropdown-item small" href="#" id="nmos">NMOS</a><a class="dropdown-item small" href="#" id="pmos">PMOS</a><a class="dropdown-item small" href="#" id="resistor">Resistor</a><a class="dropdown-item small" href="#" id="inductor">Inductor</a><a class="dropdown-item small" href="#" id="capacitor">Capacitor</a></div>'
    let delelem = main_nav.querySelectorAll('li');
    for (let i = 0; i < delelem.length - 1; i++) {
      main_nav.removeChild(delelem[i]);
    }
    main_nav.appendChild(tabItem1);
    tabItem1.addEventListener('click', function() {
    });

    clearMainArea();

    let nmos = document.querySelector("#nmos");
    let pmos = document.querySelector("#pmos");
    let resistor = document.querySelector("#resistor");
    let inductor = document.querySelector("#inductor");
    let capacitor = document.querySelector("#capacitor");
    pmos.addEventListener('click', function() {
      makeunsaved();
      createTransistor('pmos', '180', false);
    });
    nmos.addEventListener('click', function() {
      makeunsaved();
      createTransistor('nmos', '180', false);
    });
    resistor.addEventListener('click', function() {
      makeunsaved();
      createTransistor('resistor', '180', false);
    });
    inductor.addEventListener('click', function() {
      makeunsaved();
      createTransistor('inductor', '180', false);
    });
    capacitor.addEventListener('click', function() {
      makeunsaved();
      createTransistor('capacitor', '180', false);
    });


    let pnametext = document.querySelector('#project-name');
    pnametext.innerHTML = 'undefined';
  });

    

  // save as a new project event handler
  let saveButton = document.querySelector('#save');
  saveButton.addEventListener('click', function() {
    let response = {};
    for (let i = 0; i < transistorContents.length; i++) {
      response[`transistor${i}`] = {};
      response[`transistor${i}`]['data'] = transistorContents[i]['data'];
      response[`transistor${i}`]['degreeFreedom'] = transistorContents[i]['degreeFreedom'];
      response[`transistor${i}`]['primaryCalculation'] = transistorContents[i]['primaryCalculation'];
      response[`transistor${i}`]['specification'] = transistorContents[i]['specification'];
      response[`transistor${i}`]['tech'] = transistorContents[i]['tech'];
      response[`transistor${i}`]['subsymbol'] = transistorContents[i]['subsymbol'];
      response[`transistor${i}`]['tabName'] = transistorContents[i]['tabName'];
      response[`transistor${i}`]['id'] = transistorContents[i]['id'];
      response[`transistor${i}`]['type'] = transistorContents[i]['type'];
      response[`transistor${i}`]['technology'] = transistorContents[i]['technology'];
    }

    let pnametext = document.querySelector('#project-name');
    postRequest('http://localhost:3000/savedata', response);
    let savewin = window.open('http://localhost:3000/savepage', '_blank', 'location=yes, height=250, width=370, scrollbars=yes, status=yes');
    makesaved();
    let interval = setInterval(function() {
      if (savewin.closed) {
        fetch('http://localhost:3000/getpname')
          .then(response => response.json())
          .then(data => {
            pnametext.innerHTML = data['pname'];
            clearInterval(interval)
            postRequest('http://localhost:3000/savedata', response);
          });
      }
    }, 300);
  });

  // save project event handler
  let saveButtonp = document.querySelector('#savep');
  saveButtonp.addEventListener('click', function() {
    makesaved();
    let response = {};
    for (let i = 0; i < transistorContents.length; i++) {
      response[`transistor${i}`] = {};
      response[`transistor${i}`]['data'] = transistorContents[i]['data'];
      response[`transistor${i}`]['degreeFreedom'] = transistorContents[i]['degreeFreedom'];
      response[`transistor${i}`]['primaryCalculation'] = transistorContents[i]['primaryCalculation'];
      response[`transistor${i}`]['specification'] = transistorContents[i]['specification'];
      response[`transistor${i}`]['tech'] = transistorContents[i]['tech'];
      response[`transistor${i}`]['subsymbol'] = transistorContents[i]['subsymbol'];
      response[`transistor${i}`]['tabName'] = transistorContents[i]['tabName'];
      response[`transistor${i}`]['id'] = transistorContents[i]['id'];
      response[`transistor${i}`]['type'] = transistorContents[i]['type'];
      response[`transistor${i}`]['technology'] = transistorContents[i]['technology'];
    }
    postRequest('http://localhost:3000/savedata', response);
  });

  // documentation event handler
  let documentation = document.querySelector('#documentation');
  documentation.addEventListener('click', function() {
    let openwindow = window.open('http://localhost:3000/documentation', '_blank', 'location=yes, height=570, width=1000, scrollbars=yes, status=yes');
  });

  // about event handler
  let about = document.querySelector('#about');
  about.addEventListener('click', function() {
    window.open('http://localhost:3000/about', '_blank', 'location=yes, height=250, width=300, scrollbars=yes, status=yes');
  });

  // save event handler
  /*
  let save = document.querySelector('#save');
  save.addEventListener('click', function() {
    // window.open('http://localhost:3000/about', '_blank', 'location=yes, height=250, width=300, scrollbars=yes, status=yes');
    // I should replace this with a post request
    function download(content, fileName, contentType) {
      var a = document.createElement("a");
      var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
      }
      download(JSON.stringify(transistorContents), 'json.txt', 'text/plain');
  });*/
}

let idID = 1000;

function assignId() {
  idID++;
  return idID - 1;
}

function tranTypeNumber(type, tech) {
  let number;
  if (type === 'nmos') {
    number = tabNumberNMOS;
    tabNumberNMOS++;
  } else if (type === 'pmos') {
    number = tabNumberPMOS;
    tabNumberPMOS++;
  } else if (type == 'resistor') {
    number = tabNumberResistor;
    tabNumberResistor++;
  } else if (type == 'inductor') {
    number = tabNumberInductor;
    tabNumberInductor++;
  } else if (type == 'capacitor') {
    number = tabNumberCapacitor;
    tabNumberCapacitor++;
  } else {
    console.log("error");
  }
  return number;
}

let listMapList = [];

function clearMainArea() {
  let main = document.querySelector('#pages-class');
  main.innerHTML = "";
}

/*
  It takes so much time to implement the delete option for the RIC tabs
  So for now I forget about it until I find some appropriate time
*/
function createTransistor(type, tech, existedone) {
  let tranInfo = {};
  let id;
  id = assignId(); 
  tranInfo.id = id;
  tranInfo.type = type;
  tranInfo.tech = tech;
  tranInfo.index = tabNumber - 1;
  tranInfo.proBody = null;
  listMapList.push({'id': id, 'index': tabNumber-1});
  console.log(`{'id': ${id}, 'index': ${tabNumber}-1}`)
  console.log(type);
  tabNumber++;
  if (type == 'nmos' || type == 'pmos') {
    tranInfo.tabName = `${type}-${tranTypeNumber(type, tech)}`;
  } else if (type == 'resistor') {
    tranInfo.tabName = `R<sub>${tranTypeNumber(type, tech)}</sub>`;
    tranInfo.subsymbol = '1';
    tranInfo.tech = '1';
  } else if (type == 'inductor') {
    tranInfo.tabName = `L<sub>${tranTypeNumber(type, tech)}</sub>`;
    tranInfo.subsymbol = '1';
    tranInfo.tech = '1';
  } else if (type == 'capacitor') {
    tranInfo.tabName = `C<sub>${tranTypeNumber(type, tech)}</sub>`;
    tranInfo.subsymbol = '1';
    tranInfo.tech = '1';
  }
  transistorContents.push(tranInfo);
  
  if (type == 'nmos' || type == 'pmos') {
    createTransistorTab(id, type, tech);
    calculateProcesses(id, type, tech);
  } else {
    createRICTab(id, type);
  }
}

// always store the previous selected tab's id
let previousTabID = 0;


function deleteTransistorTab(id, type, tech) {
  let tab = document.querySelector(`#page-tab-${id}`);
  let index = findIndex(id);
  main_nav.removeChild(tab);
  if (type === 'nmos') {
    tabNumberNMOS--;
  } else if (type === 'pmos') {
    tabNumberPMOS--;
  } else if (type == 'resistor') {
    tabNumberResistor--;
  } else if (type == 'inductor') {
    tabNumberInductor--;
  } else if (type == 'capacitor') {
    tabNumberCapacitor--;
  }
  tabNumber--;
}

function deleteTransistorBody(id, type, tech) {
  let nav = document.querySelector(`#nav-bar-${id}`);
  let body = document.querySelector(`#main-page-${id}`);
  if (type === 'nmos' || type === 'pmos') {
    pagesClass.removeChild(nav);
  }
  pagesClass.removeChild(body);
}

function deleteTransistor(id, type, tech) {
  makeunsaved();
  console.log(transistorContents)
  deleteTransistorTab(id, type, tech);
  if (activeTabID === id) {
    deleteTransistorBody(id, type, tech);
  }
  let index = findIndex(id);
  transistorContents.splice(index, 1);
  let lenTran = transistorContents.length;
  for (let i = 0; i < lenTran; i++) {
    updateIndex(transistorContents[i]['id'], i);
  }
  if (lenTran >= 1) {
    const last = transistorContents.length - 1;
  
    makeTabItemWhite(`#page-tab-${transistorContents[last]['id']}`, transistorContents[last]['id']);
    activeTabID = transistorContents[last]['id'];

    if (transistorContents[last]['type'] == 'nmos' || transistorContents[last]['type'] == 'pmos') {
      createTransistorBody(transistorContents[last]['id'], transistorContents[last]['type'], transistorContents[last]['tech']);
      clearCharts();
      // drawHandler(transistorContents[last]['id'], transistorContents[last]['tech'], transistorContents[last]['type']);
    } else {
      createRICBody(transistorContents[last]['id'], transistorContents[last]['type']);
    }
  } else {
    clearCharts();
  }
}


function findIndex(id) {
  for (let i = 0; i < listMapList.length; i++) {
    if (listMapList[i]['id'] == id) {
      return listMapList[i]['index'];
    }
  }
  return -1;
}

function updateIndex(id, index) {
  for (let i = 0; i < listMapList.length; i++) {
    if (listMapList[i]['id'] == id) {
      listMapList[i]['index'] = index;
    }
  }
}

function makeTabItemWhite(idTab, id) {
  // debug();
  let tabs = document.querySelector('#main-nav').querySelectorAll('li');
  for (let i = 0; i < tabs.length - 1; i++) {
    tabs[i].style = "background-color: hsl(204deg 10% 90%)";
    tabs[i].className = "nav-item";
  }
  let item = document.querySelector(`${idTab}`);
  item.style.backgroundColor = 'white';
  activeTabID = id;
}

function makeTransistorTabActive(id, tab) {
  let tabs = document.querySelector(`#nav-bar-${id}`).querySelectorAll('li');
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].style = "background-color: hsl(204deg 10% 90%)";
    tabs[i].className = "nav-item small border-right border-left border-dark";
  }
  let item = document.querySelector(`#page-${tab}-${id}`);
  item.parentNode.style.backgroundColor = 'white';
}

function createRICTab(id, type) {
  let newTab = document.querySelector('#new-tab');
  let index = findIndex(id);
  let tabItem = document.createElement("li");
  let stringTemp = `<a class="nav-link small border border-dark rounded-0" aria-current="page" href="#"><span class="text-dark" id="enable-tab-${id}">${transistorContents[index]['tabName']}</span><button id="remove-tab-${id}" class="btn btn-sm btn-outline-secondary" style="margin-left: 3px; padding-top: 10;"></button></a>`;
  tabItem.style = "background-color: hsl(206deg 100% 97%)";
  tabItem.className = "nav-item bg-white";
  tabItem.id = `page-tab-${id}`;
  tabItem.innerHTML = stringTemp;
  console.log(id);
  console.log(transistorContents);
  console.log(index);
  main_nav.insertBefore(tabItem, newTab);
  // not sure to keep it or not
  let x = main_nav.querySelector(`#enable-tab-${id}`);

  // right click

  tabItem.addEventListener('click', function(event) {
    if (event.target.nodeName === 'BUTTON') {
      return;
    }
    makeTabItemWhite(`#page-tab-${id}`, id);
    createRICBody(id, type);
  });

  let tabtext = document.querySelector(`#enable-tab-${id}`)
  tabItem.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    tabtext.innerHTML = `<input type="text" style="width: 70px;" id="edit-name-button-${id}"/>`;
    let edit_name_button = document.querySelector(`#edit-name-button-${id}`);
    edit_name_button.focus();
    edit_name_button.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        let text = edit_name_button.value;
        tabtext.innerHTML = text;
        transistorContents[index]['tabName'] = text;
      }
    })
    makeunsaved();
    return false;
  }, false);

  createRICBody(id, type);

  let tabButton = document.querySelector(`#remove-tab-${id}`);
  tabButton.addEventListener('click', function(event) {
    deleteTransistor(id, type, "");
  });

  makeTabItemWhite(`#page-tab-${id}`, id);
}

// I have deleted so much things here
function RICdropdown(type, id) {
  let index = findIndex(id);
  let tabname = transistorContents[index]['tabName'];
  let name = 1;
  if (transistorContents[index]['subsymbol']) {
    name = transistorContents[index]['subsymbol']
  }

  if (type == 'resistor') {
    return `<div class="row"><div class="col-md-12"><div class="dropdown" id="dropdown-resistor-${id}"><button class="btn btn-white dropdown-toggle btn-sm" type="button"data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="dropDownLable-${id}">${name}</button><div class="dropdown-menu" id="dropdowntech"><a class="dropdown-item" href="#" id="180nm-tab" style="padding-top: 7%">1</a><a class="dropdown-item" href="#" id="90nm-tab" style="padding-top: 7%">2</a><a class="dropdown-item" href="#" id="65nm-tab" style="padding-top: 7%">3</a><a class="dropdown-item" href="#" id="45nm-tab" style="padding-top: 7%">4</a><a class="dropdown-item" href="#" id="22nm-tab" style="padding-top: 7%">5</a><a class="dropdown-item" href="#" id="22nm-tab" style="padding-top: 7%">6</a><a class="dropdown-item" href="#" id="22nm-tab" style="padding-top: 7%">7</a><a class="dropdown-item" href="#" id="22nm-tab" style="padding-top: 7%">8</a><a class="dropdown-item" href="#" id="22nm-tab" style="padding-top: 7%">9</a><a class="dropdown-item pb-1" href="#" id="22nm-tab" style="padding-top: 7%">10</a><a class="dropdown-item pb-1" href="#" id="22nm-tab" style="padding-top: 7%">G<sub>1</sub></a><a class="dropdown-item pb-1" href="#" id="22nm-tab" style="padding-top: 7%">G<sub>2</sub></a><a class="dropdown-item pb-1" href="#" id="22nm-tab" style="padding-top: 7%">G<sub>3</sub></a><a class="dropdown-item pb-1" href="#" id="22nm-tab" style="padding-top: 7%">G<sub>4</sub></a><a class="dropdown-item pb-1" href="#" id="22nm-tab" style="padding-top: 7%">G<sub>5</sub></a><a class="dropdown-item pb-1" href="#" id="22nm-tab" style="padding-top: 7%">G<sub>6</sub></a><a class="dropdown-item pb-1" href="#" id="22nm-tab" style="padding-top: 7%">G<sub>7</sub></a><a class="dropdown-item pb-1" href="#" id="22nm-tab" style="padding-top: 7%">G<sub>8</sub></a><a class="dropdown-item pb-1" href="#" id="22nm-tab" style="padding-top: 7%">G<sub>9</sub></a><a class="dropdown-item pb-1" href="#" id="22nm-tab" style="padding-top: 7%">G<sub>10</sub></a></div></div></div></div>`;
  } else if (type == 'inductor') {
      return `<div class="row"><div class="col-md-12"><div class="dropdown" id="dropdown-inductor-${id}"><button class="btn btn-white dropdown-toggle btn-sm" type="button"data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="dropDownLable-${id}">${name}</button><div class="dropdown-menu" id="dropdowntech"><a class="dropdown-item" href="#" id="180nm-tab" style="padding-top: 7%">1</a><a class="dropdown-item" href="#" id="90nm-tab" style="padding-top: 7%">2</a><a class="dropdown-item" href="#" id="65nm-tab" style="padding-top: 7%">3</a><a class="dropdown-item" href="#" id="45nm-tab" style="padding-top: 7%">4</a><a class="dropdown-item" href="#" id="22nm-tab" style="padding-top: 7%">5</a><a class="dropdown-item" href="#" id="22nm-tab" style="padding-top: 7%">6</a><a class="dropdown-item" href="#" id="22nm-tab" style="padding-top: 7%">7</a><a class="dropdown-item" href="#" id="22nm-tab" style="padding-top: 7%">8</a><a class="dropdown-item" href="#" id="22nm-tab" style="padding-top: 7%">9</a><a class="dropdown-item pb-1" href="#" id="22nm-tab" style="padding-top: 7%">10</a><a class="dropdown-item pb-1" href="#" id="22nm-tab" style="padding-top: 7%">S</a><a class="dropdown-item pb-1" href="#" id="22nm-tab" style="padding-top: 7%">G</a><a class="dropdown-item pb-1" href="#" id="22nm-tab" style="padding-top: 7%">D</a></div></div></div></div>`;
  } else if (type == 'capacitor') {
    return `<div class="row"><div class="col-md-12"><div class="dropdown" id="dropdown-capacitor-${id}"><button class="btn btn-white dropdown-toggle btn-sm" type="button"data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="dropDownLable-${id}">${name}</button><div class="dropdown-menu" id="dropdowntech"><a class="dropdown-item" href="#" id="180nm-tab" style="padding-top: 7%">1</a><a class="dropdown-item" href="#" id="90nm-tab" style="padding-top: 7%">2</a><a class="dropdown-item" href="#" id="65nm-tab" style="padding-top: 7%">3</a><a class="dropdown-item" href="#" id="45nm-tab" style="padding-top: 7%">4</a><a class="dropdown-item" href="#" id="22nm-tab" style="padding-top: 7%">5</a><a class="dropdown-item" href="#" id="22nm-tab" style="padding-top: 7%">6</a><a class="dropdown-item" href="#" id="22nm-tab" style="padding-top: 7%">7</a><a class="dropdown-item" href="#" id="22nm-tab" style="padding-top: 7%">8</a><a class="dropdown-item" href="#" id="22nm-tab" style="padding-top: 7%">9</a><a class="dropdown-item pb-1" href="#" id="22nm-tab" style="padding-top: 7%">10</a><a class="dropdown-item pb-1" href="#" id="22nm-tab" style="padding-top: 7%">DB</a><a class="dropdown-item pb-1" href="#" id="22nm-tab" style="padding-top: 7%">SB</a></div></div></div></div>`;
  }
  
  return `<li class="nav-item dropdown"><a class="nav-link dropdown-toggle small" aria-current="page" href="#" data-toggle="dropdown"><span class="text-dark" id="tab-name">1</span></a><div class="dropdown-menu small" aria-labelledby="first-page-tab"><a class="dropdown-item small" href="#" id="nmos">1</a><a class="dropdown-item small" href="#" id="pmos">2</a><a class="dropdown-item small" href="#" id="resistor">3</a><a class="dropdown-item small" href="#" id="inductor">4</a><a class="dropdown-item small" href="#" id="capacitor">5</a><a class="dropdown-item small" href="#" id="capacitor">6</a><a class="dropdown-item small" href="#" id="capacitor">7</a><a class="dropdown-item small" href="#" id="capacitor">8</a><a class="dropdown-item small" href="#" id="capacitor">9</a><a class="dropdown-item small" href="#" id="capacitor">10</a></div></li>`;
  // return `<a class="nav-link dropdown-toggle small" aria-current="page" href="#" data-toggle="dropdown"><span class="text-dark" id="tab-name">1</span></a><div class="dropdown-menu small" aria-labelledby="first-page-tab"><a class="dropdown-item small" href="#" id="nmos">1</a><a class="dropdown-item small" href="#" id="pmos">2</a><a class="dropdown-item small" href="#" id="resistor">3</a><a class="dropdown-item small" href="#" id="inductor">4</a><a class="dropdown-item small" href="#" id="capacitor">5</a><a class="dropdown-item small" href="#" id="capacitor">6</a><a class="dropdown-item small" href="#" id="capacitor">7</a><a class="dropdown-item small" href="#" id="capacitor">8</a><a class="dropdown-item small" href="#" id="capacitor">9</a><a class="dropdown-item small" href="#" id="capacitor">10</a></div>`;
}

function createRICBody(id, type) {
  clearMainArea();
  let index = findIndex(id);
  mainPage = document.createElement("div");
  mainPage.className = "border border-info rounded w-100";
  mainPage.id = `main-page-${id}`;
  mainPage.style = "overflow: auto; height: 75vh; padding: 1%;";
  if (transistorContents[index]['subsymbol']) {
    mainPage.tech = transistorContents[index]['subsymbol'];
    mainPage.subsymbol = transistorContents[index]['subsymbol'];
  } else {
    mainPage.tech = '1';
    mainPage.subsymbol = '1';
  }
  let symbolName;
  if (type == 'resistor') {
    symbolName = 'R';
  } else if (type == 'inductor') {
    symbolName = 'L';
  } else if (type == 'capacitor') {
    symbolName = 'C';
  }
  let stringTemp = `<div class="row mt-5"><div class="col-md-4"></div><div class="col-md-4"><div class="align-items-center border border-secondary rounded" style="padding-bottom: 5%; background-color: gainsboro;"><div class="container"><div class="row" id="s_tab_"><div class="col-5" style="padding-top: 20%; padding-left: 0; float:left;"><span>${symbolName}<sub>${RICdropdown(type, id)}</sub></span></div><div class="col-5 px-0" style="padding-top: 17%;"><input type="text" id="RIC-input-${id}" class="form-control mx-0 px-0" style="text-align: center; font-size: 0.8em; padding-left: 0; float: left; margin-left: 0; margin-right: 0;"></div><div class="col-2 px-0" style="float: left; padding-top: 18%"><small class="text-muted"><i>unit</i></small></div></div></div></div></div><div class="col-md-4"></div></div>`;
  // let stringTemp = `<div class="row mt-5"><div class="col-md-4"></div><div class="col-md-4"><div class="align-items-center border border-secondary rounded" style="padding-bottom: 5%; background-color: gainsboro;"><div class="container"><div class="row" id="s_tab_"><div class="col-2" style="padding-top: 20%; padding-left: 0; float:left;"><span>${symbolName}<sub>${RICdropdown(type)}</sub></span></div><div class="col-5 px-0" style="padding-top: 17%;"><input type="text" id="t_ox_textbox" class="form-control mx-0 px-0" style="text-align: center; font-size: 0.8em; padding-left: 0; float: left; margin-left: 0; margin-right: 0;"></div><div class="col-2 px-0" style="float: left; padding-top: 18%"><small class="text-muted"><i>unit</i></small></div><div class="col-3" style="padding-top: 10%"><div class="slider-wrapper"><input type="range" list="tickmarks" id="t_ox_bar"><datalist id="tickmarks"><option value="0" label="0%"></option><option value="10"></option><option value="20"></option><option value="30"></option><option value="40"></option><option value="50" label="50%"></option><option value="60"></option><option value="70"></option><option value="80"></option><option value="90"></option><option value="100" label="100%"></option></datalist></div></div></div></div></div></div><div class="col-md-4"></div></div>`;
  mainPage.innerHTML = stringTemp;
  pagesClass.appendChild(mainPage);  

  if (transistorContents[index]['primaryCalculation']) {
    document.querySelector(`#RIC-input-${id}`).value = transistorContents[index]['primaryCalculation'];
  } else {
    document.querySelector(`#RIC-input-${id}`).value = 0
  }

  document.querySelector(`#RIC-input-${id}`).addEventListener('change', () => {
    transistorContents[index]['primaryCalculation'] = document.querySelector(`#RIC-input-${id}`).value;
  })

  if (type == 'resistor') {
    let resistorDropDown = document.querySelector(`#dropdown-resistor-${id}`);
    let resistorDropDownItems = resistorDropDown.querySelectorAll("a");
    for (let i = 0; i < resistorDropDownItems.length; i++) {
      resistorDropDownItems[i].addEventListener('click', function() {
        makeunsaved();
        transistorContents[index]['subsymbol'] = resistorDropDownItems[i].textContent;
        // I use available tech field for the transistor here to store index of the RIC
        transistorContents[index]['tech'] = resistorDropDownItems[i].textContent;
        let resistorDropDownBtn = resistorDropDown.querySelector('button');
        resistorDropDownBtn.textContent = resistorDropDownItems[i].textContent;
        // I save the value of the RIC in the primaryCalculation field of the transistorContents
        // transistorContents[index]['primaryCalculation'] = document.querySelector(`#RIC-input-${id}`).value;
        
      });
    }
  } else if (type == 'inductor') {
    let inductorDropDown = document.querySelector(`#dropdown-inductor-${id}`);
    let inductorDropDownItems = inductorDropDown.querySelectorAll("a");
    for (let i = 0; i < inductorDropDownItems.length; i++) {
      inductorDropDownItems[i].addEventListener('click', function() {
        makeunsaved();
        transistorContents[index]['subsymbol'] = inductorDropDownItems[i].textContent;
        transistorContents[index]['tech'] = inductorDropDownItems[i].textContent;
        let inductorDropDownBtn = inductorDropDown.querySelector('button');
        inductorDropDownBtn.textContent = inductorDropDownItems[i].textContent;
        // transistorContents[index]['primaryCalculation'] = document.querySelector(`#RIC-input-${id}`).value;
      });
    }
  } else if (type == 'capacitor') {
    let capacitorDropDown = document.querySelector(`#dropdown-capacitor-${id}`);
    let capacitorDropDownItems = capacitorDropDown.querySelectorAll("a");
    for (let i = 0; i < capacitorDropDownItems.length; i++) {
      capacitorDropDownItems[i].addEventListener('click', function() {
        makeunsaved();
        transistorContents[index]['subsymbol'] = capacitorDropDownItems[i].textContent;
        transistorContents[index]['tech'] = capacitorDropDownItems[i].textContent;
        let capacitorDropDownBtn = capacitorDropDown.querySelector('button');
        capacitorDropDownBtn.textContent = capacitorDropDownItems[i].textContent;
        // transistorContents[index]['primaryCalculation'] = document.querySelector(`#RIC-input-${id}`).value;
      });
    }
  }
}

function createTransistorTab(id, type, tech) {
  let newTab = document.querySelector('#new-tab');
  let index = findIndex(id);
  let tabItem = document.createElement("li");
  let stringTemp = `<a class="nav-link small border border-dark rounded-0" aria-current="page" href="#"><span class="text-dark" id="enable-tab-${id}">${transistorContents[index]['tabName']}</span><button id="remove-tab-${id}" class="btn btn-sm btn-outline-secondary" style="margin-left: 3px; padding-top: 10;"></button></a>`;
  tabItem.style = "background-color: hsl(206deg 100% 97%)";
  tabItem.className = "nav-item bg-white";
  tabItem.id = `page-tab-${id}`;
  tabItem.innerHTML = stringTemp;
  main_nav.insertBefore(tabItem, newTab);
  // not sure to keep it or not
  let x = main_nav.querySelector(`#enable-tab-${id}`);

  // right click
  
  tabItem.addEventListener('click', function(event) {
    if (event.target.nodeName === 'BUTTON') {
      return;
    }
    makeTabItemWhite(`#page-tab-${id}`, id);
    createTransistorBody(id, type, tech);
    // drawHandler(id, tech, type);
  });

  let tabtext = document.querySelector(`#enable-tab-${id}`)
  tabItem.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    tabtext.innerHTML = `<input type="text" style="width: 70px;" id="edit-name-button-${id}"/>`;
    let edit_name_button = document.querySelector(`#edit-name-button-${id}`);
    edit_name_button.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        let text = edit_name_button.value;
        tabtext.innerHTML = text;
        transistorContents[index]['tabName'] = text;
      }
    })
    makeunsaved();
    return false;
  }, false);

  let tabtextname = document.querySelector(`#enable-tab-${id}`)
  tabItem.addEventListener('contextmenu', function(ev) {
    tabtextname.innerHTML = `<input type="text" style="width: 70px;" id="edit-name-button-${id}"/>`;
    let edit_name_button = document.querySelector(`#edit-name-button-${id}`);
    edit_name_button.focus();
    edit_name_button.addEventListener('keypress', function(e) {
      if (e.target.nodeName === 'BUTTON') {
        return;
      }
      if (e.key === 'Enter') {
        let text = edit_name_button.value;
        tabtextname.innerHTML = text;
        transistorContents[index]['tabName'] = text;
      }
    })
    makeunsaved();
    return false;
  }, false);

  let tabButton = document.querySelector(`#remove-tab-${id}`);
  tabButton.addEventListener('click', function(event) {
    deleteTransistor(id, type, tech);
  });

  makeTabItemWhite(`#page-tab-${id}`, id);
}

function updateTransistor(id, type, tech) {
  let index = findIndex(id);
  transistorContents[index]['tech'] = tech;
  // overwrite the calculations
  createTransistorBody(id, type, tech);
}

/* this creates the four tabs for each transistor and nothing else */
function createTransistorBody(id, type, tech) {
  clearMainArea();
  let navBar = document.createElement("div");
  navBar.className = "col-md-12 mx-0 px-0";
  navBar.id = `nav-bar-${id}`;
  // change parametrs to Process parametrs
  let insideHTML = `<ul class="nav nav-pills border-info border-top border-right border-buttom-0 border-left"><li class="nav-item bg-white small border-right border-left border-dark"><a class="nav-link text-dark" aria-current="page" href="#" id="page-processes-${id}">Process Parameters</a></li><li class="nav-item small border-right border-left border-dark" style="background-color: hsl(204deg 10% 90%)"><a class="nav-link text-dark" href="#" id="page-degree-${id}">Degrees of Freedom</a></li><li class="nav-item small border-right border-left border-dark" style="background-color: hsl(204deg 10% 90%)"><a class="nav-link text-dark" href="#" tabindex="-1" aria-disabled="true" id="page-calculation-${id}" >Primary Calculations</a></li><li class="nav-item small border-right border-left border-dark" style="background-color: hsl(204deg 10% 90%)"><a class="nav-link text-dark" href="#" id="page-specification-${id}">Specifications</a></li></ul>`;
  navBar.innerHTML = insideHTML;
  pagesClass.appendChild(navBar);
  
  // define event listeners
  let processesEvent = navBar.querySelector(`#page-processes-${id}`);
  let degreeEvent = navBar.querySelector(`#page-degree-${id}`);
  let calculationEvent = navBar.querySelector(`#page-calculation-${id}`);
  let specificationEvent = navBar.querySelector(`#page-specification-${id}`);
  processesEvent.addEventListener('click', function() {
    mainBodyGenerator(id, type, tech, 'processes');
  });

  degreeEvent.addEventListener('click', function() {
    mainBodyGenerator(id, type, tech, 'degree');
  });

  calculationEvent.addEventListener('click', function() {
    mainBodyGenerator(id, type, tech, 'calculation');
  });

  specificationEvent.addEventListener('click', function() {
    mainBodyGenerator(id, type, tech, 'specification');
  });

  generateProcessesBody(id, type, tech);
}

function calculateProcesses(id, type, tech) {
  let index = findIndex(id);
  if (transistorContents[index]['data']) {
    startEveryThing(transistorContents[index]['data'], id, type, tech, index, true);
  } else {
    fetch('http://localhost:3000/json/' + type + '-' + tech + '.json')
    .then(response => response.json())
    .then((data) => {
      startEveryThing(data, id, type, tech, index, false);
    });
  }
}

function updateProcessesData(id, type, tech) {
  let index = findIndex(id);
  fetch('http://localhost:3000/json/' + type + '-' + tech + '.json')
    .then(response => response.json())
    .then((data) => {
      startEveryThing(data, id, type, tech, index, false);
    });
}

function startEveryThing(data, id, type, tech, index, existed) {
  if (!existed) {
    transistorContents[index]['data'] = data.params;
    console.log(data.params);
    calculateDegree(id, type, tech);
  }
  calculateDegree(id, type, tech);
  calculateCalculation(id, type, tech);
  calculateSpecification(id, type, tech);
  createTransistorBody(id, type, tech);
  transistorContents[index]['activePage'] = 'processes';
  // drawHandler(id, tech, type);
}

function calculateDegree(id, type, tech) {
  let index = findIndex(id);
  let data = transistorContents[index]['data'];
  transistorContents[index]["technology"] = tech;

  let info;

  if (!transistorContents[index]['degreeFreedom']) {
    info = {'L' : {'value': tech / 1000, 'min': tech / 1000, 'max': tech / 1000},
             'IC' : {'value': 1, 'min': 0, 'max': 100},
             'I_D' : {'value': 100, 'min': 0, 'max': 4000},
             'W' : {'value': 2880, 'min': 0, 'max': 3000},
             'V_EFF' : {'value': 0.2, 'min': 0, 'max': 100},
             'GMdivID' : {'value': 17, 'min': 0, 'max': 100}
    };
  } else {
     for (const [i, v] of Object.entries(transistorContents[index]['degreeFreedom'])) {
      for (let [j, w] of Object.entries(v)) {
        transistorContents[index]['degreeFreedom'][i][j] = Number(w);
      }
     }
     info = transistorContents[index]['degreeFreedom'];
  }


  let c_ox = 34.5 / data["t_ox"]['value'];

  let U_T = 0.0258 * (data['T']['value'] / 300);

  let I_0;
  if (type === 'nmos') {
    I_0 = 2 * data['n']['value'] * data['mu_n']['value'] * c_ox * Math.pow(U_T, 2) / 10;
  } else if (type === 'pmos') {
    I_0 = 2 * data['n']['value'] * data['mu_p']['value'] * c_ox * Math.pow(U_T, 2) / 10;
  } else {
    console.log("-error");
  }


  info['W']['value'] = (info['L']['value'] / info['IC']['value']) * (info['I_D']['value'] / I_0);
  info['V_EFF']['value'] = calculateVEFF(id, info['IC']['value'], info['L']['value']);
  info['GMdivID']['value'] = calculateGMID(id, info['IC']['value'], info['L']['value']);
  transistorContents[index]['degreeFreedom'] = info;
  return info;
}

function calculateCalculation(id, type, tech) {
  let index = findIndex(id);
  let data = transistorContents[index]['data'];
  let info = transistorContents[index]['degreeFreedom'];

  let primaryCalculationObj = {};
  let IC = info['IC']['value'];
  let I_D = info['I_D']['value'];
  let L = info['L']['value'];
  let W = info['W']['value'];
  let V_EFF = info['V_EFF']['value'];
  V_EFF = parseFloat(V_EFF)


  // V_T calculation
  let V_T;
  V_T = data['V_T0']['value'] + ((data['n']['value'] - 1) * data['V_SB']['value']);
  V_T = parseFloat(V_T)
  primaryCalculationObj['V_T'] = V_T;

  // c_ox
  let c_ox = 34.5 / data["t_ox"]['value'];
  primaryCalculationObj['c_ox'] = c_ox;

  // U_T
  let U_T = 0.0258 * (data['T']['value'] / 300);
  primaryCalculationObj['U_T'] = U_T;

  // k
  let k;
  if (type === 'nmos')
    k = 10 * data['mu_n']['value'] * c_ox / 100;
  else if (type === 'pmos')
    k = 10 * data['mu_p']['value'] * c_ox / 100;
  else 
    console.log("-error");
  primaryCalculationObj['k'] = k;

  // I_0 calculation
  let I_0;
  
  if (type === 'nmos')
    I_0 = 2 * data['n']['value'] * data['mu_n']['value'] * c_ox * Math.pow(U_T, 2) / 10;
  else if (type === 'pmos')
    I_0 = 2 * data['n']['value'] * data['mu_p']['value'] * c_ox * Math.pow(U_T, 2) / 10;
  else 
    console.log("-error");
  primaryCalculationObj['I_0'] = I_0;

  // LE_CRIT_P_min
  let LE_CRIT_P_min = ((1 / data["theta"]['value']) * data["L_min"]['value'] * data["E_CRIT"]['value']) / ((1 / data["theta"]['value']) + data["L_min"]['value'] * data["E_CRIT"]['value']);
  primaryCalculationObj['LE_CRIT_P_min'] = Number(LE_CRIT_P_min);

  // LE_CRIT_P
  let LE_CRIT_P = ((1 / data["theta"]['value']) * L * data["E_CRIT"]['value']) / ((1 / data["theta"]['value']) + L * data["E_CRIT"]['value']);
  primaryCalculationObj['LE_CRIT_P'] = Number(LE_CRIT_P);

  // V_A_CLM
  let V_A_CLM = data["V_AL"]['value'] * L;
  V_A_CLM = V_A_CLM.toFixed(2);
  primaryCalculationObj['V_A_CLM'] = V_A_CLM;

  // IC_CRIT_min
  let IC_CRIT_min = Math.pow(LE_CRIT_P_min / (4 * data["n"]['value'] * U_T), 2);
  primaryCalculationObj['IC_CRIT_min'] = IC_CRIT_min;

  // IC_CRIT
  let IC_CRIT = Math.pow(LE_CRIT_P / (4 * data["n"]['value'] * U_T), 2);
  primaryCalculationObj['IC_CRIT'] = IC_CRIT;

  // B
  let B = IC * (1 + (IC / IC_CRIT));
  primaryCalculationObj['B'] = B;

  let base = Math.pow((IC / (4 * IC_CRIT) ), data["beta"]['value']);
  let exponent = 1 / data["beta"]['value'];
  let secondBase = Math.pow((1 + base), exponent);

  // A
  let A = secondBase * IC;
  primaryCalculationObj['A'] = A;

  // V_A_DIBL
  let ifPmos = -1;
  if (type === 'nmos') {
    ifPmos = 1;
  }
  console.log(typeof IC)
  console.log(Math.sqrt(IC + 0.25))
  console.log(data['L_min']['value'])
  console.log(ifPmos)
  console.log(data["n"]['value'] , U_T , Math.sqrt(IC + 0.25), data['BL']['value'] , Math.pow(data['L_min']['value']), L, data['LEXP']['value']);
  let V_A_DIBL = ifPmos * (data["n"]['value'] * U_T * (Math.sqrt(IC + 0.25) + 0.5)) / (-1 * data['BL']['value'] * 0.001 * Math.pow((data['L_min']['value'] / L), data['LEXP']['value']));
  primaryCalculationObj['V_A_DIBL'] = V_A_DIBL;

  // C_GOX
  let C_GOX = W * L * c_ox;
  primaryCalculationObj['C_GOX'] = C_GOX;

  // X
  let X = (((Math.sqrt(Number(IC) + 0.25) + 0.5) + 1) / Math.pow((Math.sqrt(Number(IC) + 0.25) + 0.5), 2));
  primaryCalculationObj['X'] = X;

  // C_gsi_hat
  let C_gsi_hat = (2 - X) / 3;
  primaryCalculationObj['C_gsi_hat'] = C_gsi_hat;

  // C_gbi_hat
  let C_gbi_hat = ((X + 1) / 3) * ((data["n"]['value'] - 1) / data["n"]['value']);
  primaryCalculationObj['C_gbi_hat'] = C_gbi_hat;

  // C_gsi
  let C_gsi = C_GOX * C_gsi_hat;
  primaryCalculationObj['C_gsi'] = C_gsi;

  // C_gbi
  let C_gbi = C_GOX * C_gbi_hat;
  primaryCalculationObj['C_gbi'] = C_gbi;

  // C_gdi
  let C_gdi = data['C_gdi_hat']['value'] * C_GOX;
  primaryCalculationObj['C_gdi'] = C_gdi;

  // C_gso
  let C_gso = data['C_GS0V']['value'] * W;
  primaryCalculationObj['C_gso'] = C_gso;

  // C_gdo
  let C_gdo = data['C_GD0V']['value'] * W;
  primaryCalculationObj['C_gdo'] = C_gdo;

  // C_gbo
  let C_gbo = data['C_GB0V']['value'] * L;
  primaryCalculationObj['C_gbo'] = C_gbo;

  // C_gs
  let C_gs = C_gsi + C_gso;
  primaryCalculationObj['C_gs'] = C_gs;

  // C_gd
  let C_gd = C_gdi + C_gdo;
  primaryCalculationObj['C_gd'] = C_gd;

  // C_gb
  let C_gb = C_gbi + C_gbo;
  primaryCalculationObj['C_gb'] = C_gb;

  // gamma
  let gamma = (1 / (1 + IC) * ( (1 / 2) + (2 / 3) * IC ));
  primaryCalculationObj['gamma'] = gamma;


  // Kp_F
  let Kp_F = data["KP_F0"]['value'] * Math.pow (1 + V_EFF / data["V_KF"]['value'], 2); 
  primaryCalculationObj['Kp_F'] = Kp_F;

  // K_F
  let K_F = data["K_F0"]['value'] * Math.pow (1 + V_EFF / data["V_KF"]['value'], 2);
  K_F = K_F * 1e+31;
  K_F = K_F.toFixed(3);
  K_F = K_F * 1e-31;
  primaryCalculationObj['K_F'] = K_F;

  // L_eff
  let L_eff = L - 2 * data['DL']['value'];
  primaryCalculationObj['L_eff'] = L_eff;
  
  // W_eff
  let W_eff = W - 2 * data['DW']['value'];
  primaryCalculationObj['W_eff'] = W_eff;

  // PH_0
  let PHI_0 = 2 *  data['PHI_F']['value'] + 4 * U_T;
  primaryCalculationObj['PHI_0'] = PHI_0;

  // AV_T
  let AV_T = data["A_VT0"]['value'] * (1 + (data['V_SB']['value'] / (2 * PHI_0)));
  primaryCalculationObj['AV_T'] = AV_T;

  // eta
  let eta = data["n"]['value'] - 1;
  eta = eta.toFixed(2);
  primaryCalculationObj['eta'] = eta;

  // V_GS
  let V_GS = V_EFF + V_T;
  primaryCalculationObj['V_GS'] = V_GS;

  // K_GA
  let K_GA = (80 * Math.pow(Math.E, -14 * data['t_ox']['value'])) / (Math.pow(data['t_ox']['value'], 2));
  K_GA = K_GA * 1e+25;
  K_GA = K_GA.toFixed(3);
  K_GA = K_GA * 1e-25;
  primaryCalculationObj['K_GA'] = K_GA;

  // K_GB
  let K_GB = 1.13 * data['t_ox']['value'];
  K_GB = K_GB.toFixed(4);
  primaryCalculationObj['K_GB'] = K_GB;

  // L_sat
  let mutemp = 0;
  if (type === 'nmos')
    mutemp = data['mu_n']['value'];
  else if (type === 'pmos')
  mutemp = data['mu_p']['value'];
  else 
    console.log("-error");
  let L_sat = 2 * mutemp * U_T * 100 / data['V_sat']['value'];
  primaryCalculationObj['L_sat'] = L_sat;

  // Lambda_c
  let Lambda_c = L_sat / L;
  primaryCalculationObj['Lambda_c'] = Lambda_c;

  transistorContents[index]["primaryCalculation"] = primaryCalculationObj;
  return primaryCalculationObj;  
}

function calculateVEFF(id, IC, L) {
  let index = findIndex(id);
  let data = transistorContents[index]['data'];
  let U_T = 0.0258 * (data['T']['value'] / 300);
  let LE_CRIT_P = ((1 / data["theta"]['value']) * L * data["E_CRIT"]['value']) / ((1 / data["theta"]['value']) + L * data["E_CRIT"]['value']);
  let IC_CRIT = Math.pow(LE_CRIT_P / (4 * data["n"]['value'] * U_T), 2);
  let B = IC * (1 + (IC / IC_CRIT));
  let base = Math.pow((IC / (4 * IC_CRIT) ), data["beta"]['value']);
  let exponent = 1 / data["beta"]['value'];
  let secondBase = Math.pow((1 + base), exponent);
  let A = IC * secondBase;
  return 2 * data['n']['value'] * U_T * Math.log(Math.pow(Math.E, Math.sqrt(A)) - 1);
}

function calculateGMID(id, IC, L) {
  let index = findIndex(id);
  let data = transistorContents[index]['data'];
  let U_T = 0.0258 * (data['T']['value'] / 300);
  // This might be true, but I copied the le_crit_p from the related section
  // let LE_CRIT_P = (valueOf(tabSelectedNumber, "theta") * L * valueOf(tabSelectedNumber, "E_CRIT")) / (valueOf(tabSelectedNumber, "theta") + L * valueOf(tabSelectedNumber, "E_CRIT"));
  let LE_CRIT_P = ((1 / data["theta"]['value']) * L * data["E_CRIT"]['value']) / ((1 / data["theta"]['value']) + L * data["E_CRIT"]['value']);
  let IC_CRIT = Math.pow(LE_CRIT_P / (4 * data["n"]['value'] * U_T), 2);
  let B = IC * (1 + (IC / IC_CRIT));
  let GMdivID = 1 / (data["n"]['value'] * U_T * (Math.sqrt(B + 0.25) + 0.5));
  return GMdivID;
}

function calculateSpecification(id, type, tech) {
  let index = findIndex(id);
  let primaryCalculation = transistorContents[index]["primaryCalculation"];
  let data = transistorContents[index]["data"];
  let info = transistorContents[index]["degreeFreedom"];
  let specificationObj = {};
  let IC = info['IC']['value'];
  let I_D = info['I_D']['value'];
  let L = info['L']['value'];
  info['W']['value'] = (L / IC) * (I_D / primaryCalculation['I_0']);
  info['V_EFF']['value'] = calculateVEFF(id, IC, L);
  let W = info['W']['value'];
  let V_EFF = info['V_EFF']['value'];
  specificationObj['W'] = W;
  // gate area
  let WL;
  WL = (Math.pow(L, 2) / IC) * (I_D / primaryCalculation['I_0']);
  specificationObj['WL'] = WL;
  // WdivL calculation
  let WdivL;
  WdivL = (1 / IC) * (I_D / primaryCalculation['I_0']);
  specificationObj['WdivL'] = WdivL;
  specificationObj['V_EFF'] = V_EFF;
  // V_DS
  let V_DS = 2 * primaryCalculation['U_T'] * Math.sqrt(Number(IC) + 0.25) + 3 * primaryCalculation['U_T'];
  specificationObj['V_DS'] = V_DS;
  // GMdivID
  let GMdivID = 1 / (data["n"]['value'] * primaryCalculation['U_T'] * (Math.sqrt(primaryCalculation['B'] + 0.25) + 0.5));
  specificationObj['GMdivID'] = GMdivID;
  // V_A
  let numerator = primaryCalculation['V_A_CLM'] * primaryCalculation['V_A_DIBL'];
  let denominator = Number(primaryCalculation['V_A_CLM']) + Number(primaryCalculation['V_A_DIBL']);
  let V_A = (numerator) / (denominator);
  // GDSdivID
  let GDSdivID = 1 / (V_A + V_DS);
  specificationObj['GDSdivID'] = GDSdivID;
  // g_m
  let g_m = GMdivID * I_D;;
  specificationObj['g_m'] = g_m;
  // g_ds
  let g_ds = GDSdivID * I_D;;
  specificationObj['g_ds'] = g_ds;
  // g_mb
  let g_mb = primaryCalculation['eta'] * g_m;
  specificationObj['g_mb'] = g_mb;
  // r_ds
  let r_ds = (1 / g_ds) * 1000;
  specificationObj['r_ds'] = r_ds;
  // A_1dBWI
  let A_1dBWI = 1.22 * (data["n"]['value'] * primaryCalculation['U_T']);
  specificationObj['A_1dBWI'] = A_1dBWI;
  // A_1dBSI
  let A_1dBSI = 1.81 * (data["n"]['value'] * primaryCalculation['U_T'] * Math.sqrt(primaryCalculation['B']));
  specificationObj['A_1dBSI'] = A_1dBSI;
  
  specificationObj['V_A'] = V_A;
  // AV_i
  let AV_i = (V_A) / (data["n"]['value'] * primaryCalculation['U_T'] * (Math.sqrt(primaryCalculation['B'] + 0.25) + 0.5));
  specificationObj['AV_i'] = AV_i;
  let mu;
  if (type === 'nmos') {
    mu = data["mu_n"]['value'];
  } else if (type === 'pmos') {
    mu = data["mu_p"]['value'];
  }
  // fT_i
  let fT_i = (((IC) / (Math.sqrt(primaryCalculation['B'] + 0.25) + 0.5)) * ((mu * primaryCalculation['U_T']) / (Math.PI * (primaryCalculation['C_gbi_hat'] + primaryCalculation['C_gsi_hat']) * Math.pow(L, 2)))) / 10;
  specificationObj['fT_i'] = fT_i;

  // f_T
  let f_T = g_m / (2 * Math.PI * (primaryCalculation['C_gs'] + primaryCalculation['C_gb']))
  specificationObj['f_T'] = f_T;

  // f_Tr
  let f_Tr = g_m / (2 * Math.PI * primaryCalculation['C_gs'])
  specificationObj['f_Tr'] = f_Tr;

  // S_VG
	let S_VG = Math.pow(2.069, 2)* Math.pow((data["T"]['value'] / 300), 2) * Math.pow((data["n"]['value']), 2) * primaryCalculation['gamma'] * (Math.sqrt(primaryCalculation['B'] + 0.25) + 0.5) * (100 / I_D);
  specificationObj['S_VG'] = S_VG;
  // S_VG_sqrt
	let S_VG_sqrt = Math.sqrt(S_VG);
  specificationObj['S_VG_sqrt'] = S_VG_sqrt;
  // S_VGF
  let S_VGF = (IC / Math.pow(L, 2)) * (primaryCalculation['I_0'] / I_D) * (primaryCalculation['Kp_F'] / (Math.pow(data["f"]['value'], data["AF"]['value'])));
  specificationObj['S_VGF'] = S_VGF;
  
  // S_VGF_sqrt
	let S_VGF_sqrt = Math.sqrt(S_VGF);
  specificationObj['S_VGF_sqrt'] = S_VGF_sqrt;
  // f_c
  let f_c = Math.pow( (3.79e-13 * (300 / data["T"]['value']) * primaryCalculation['Kp_F'] *  primaryCalculation['c_ox'] * fT_i * ((primaryCalculation['C_gbi_hat'] + primaryCalculation['C_gsi_hat']) / ((data["n"]['value'] * primaryCalculation['gamma'])))) , (1 / data["AF"]['value']));
  specificationObj['f_c'] = f_c;
  // DV_T
   let DV_T = (data["A_VT0"]['value'] * (1 + (data["V_SB"]['value']) / ( 2 *  primaryCalculation['PHI_0']))) / Math.sqrt(WL);
  specificationObj['DV_T'] = DV_T;
  // DKpdivKp
  let DKpdivKp = (data["A_KP"]['value'] / Math.sqrt(WL)) * 100;
  specificationObj['DKpdivKp'] = DKpdivKp;
  // DV_GS
  let DV_GS = (((Math.sqrt(IC) / L) * (Math.sqrt(primaryCalculation['I_0'] / I_D))) * Math.sqrt( Math.pow(primaryCalculation['AV_T'], 2) + Math.pow((data["A_KP"]['value'] * data["n"]['value'] * (primaryCalculation['U_T'] * 1000) * Math.sqrt(primaryCalculation['B'] + 0.25) + 0.5), 2)));
  specificationObj['DV_GS'] = DV_GS;
  
  // DIDdivID
  let DIDdivID = (((Math.sqrt(IC) / L) * (Math.sqrt(primaryCalculation['I_0'] / I_D))) * (Math.sqrt(Math.pow(primaryCalculation['AV_T'] / (data["n"]['value'] * (primaryCalculation['U_T'] * 1000) * (Math.sqrt(primaryCalculation['B'] + 0.25) + 0.5)), 2) + Math.pow(data["A_KP"]['value'], 2)))) * 100;
  specificationObj['DIDdivID'] = DIDdivID;
  // I_GSL

  let I_GSL = ((Math.pow(L, 2) / IC) * (I_D / primaryCalculation['I_0']) * primaryCalculation['K_GA'] * (data['n']['value'] * primaryCalculation['U_T'] * Math.log(1 + Math.pow(Math.E, (V_EFF / (data['n']['value'] * primaryCalculation['U_T']))))) * primaryCalculation['V_GS'] * (Math.pow(Math.E, primaryCalculation['K_GB'] * primaryCalculation['V_GS']))) * 1e+6;
  I_GSL *= 1e+19;
  I_GSL = I_GSL.toFixed(4);
  I_GSL = I_GSL * 1e-19;
  specificationObj['I_GSL'] = I_GSL;
  // GMIDFT
  let GMIDFT = GMdivID * fT_i;
  specificationObj['GMIDFT'] = GMIDFT;
  // AVIFTI
  let AVIFTI = AV_i * fT_i;
  specificationObj['AVIFTI'] = AVIFTI;
  transistorContents[index]["specification"] = specificationObj;
  return specificationObj;
}

function mainBodyGenerator(id, type, tech, tab) {
  const mainBody = document.querySelector(`#main-page-${id}`);
  pagesClass.removeChild(mainBody);

  if (tab === 'processes') {
    makeTransistorTabActive(id, 'processes');
    generateProcessesBody(id, type, tech);
  } else if (tab === 'degree') {
    makeTransistorTabActive(id, 'degree');
    generateDegreeBody(id, type, tech);
  } else if (tab === 'calculation') {
    makeTransistorTabActive(id, 'calculation');
    generateCalculationBody(id, type, tech);
  } else if (tab === 'specification') {
    makeTransistorTabActive(id, 'specification');
    generateSpecificationBody(id, type, tech)
  }
}

function generateProcessesBody(id, type, tech) {
  let index = findIndex(id);
  // makeTransistorTabActive(id, 'processes');
  mainPage = document.createElement("div");
  mainPage.className = "border border-info rounded w-100";
  mainPage.id = `main-page-${id}`;
  mainPage.style = "overflow: auto; height: 75vh; padding: 1%;";
  let stringTemp = `<div class="row"><div class="col-md-12"><div class="dropdown mt-1" style="margin-left: 5%;"><button class="btn btn-secondary dropdown-toggle btn-sm" type="button"data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="dropDownLable-${id}">${transistorContents[index]["technology"]}nm</button><div class="dropdown-menu" id="dropdowntech-${id}"><a class="dropdown-item font-weight-bold" href="#" id="180nm-tab-${id}">180nm</a><a class="dropdown-item font-weight-bold" href="#" id="90nm-tab-${id}">90nm</a><a class="dropdown-item font-weight-bold" href="#" id="65nm-tab-${id}">65nm</a><a class="dropdown-item font-weight-bold" href="#" id="45nm-tab-${id}">45nm</a><a class="dropdown-item font-weight-bold" href="#" id="22nm-tab-${id}">22nm</a></div></div></div></div><br><div id="processes-${id}"></div>`;
  mainPage.innerHTML = stringTemp;
  pagesClass.appendChild(mainPage);
  createProcesses(id, type, tech);

  let techDropdown = document.querySelector(`#dropdowntech-${id}`);
  let techDropdownItems = techDropdown.querySelectorAll("a");
  for (let i = 0; i < techDropdownItems.length; i++) {
    techDropdownItems[i].addEventListener('click', function() {
      makeunsaved();
      let techTemp = this.innerHTML.slice(0, this.innerHTML.indexOf('n'));
      let dropDownLable = document.querySelector(`#dropDownLable-${id}`);
      dropDownLable.textContent = this.innerHTML;
      transistorContents[index]['tech'] = techTemp;
      transistorContents[index]['degreeFreedom']['L'] = {'value': Number(techTemp) * 0.001, 'min': Number(techTemp) * 0.001, 'max': Number(techTemp) * 0.001};
      updateProcessesData(id, type, techTemp);
      transistorContents[index]["technology"] = `${this.innerHTML}`;
    });
  }
}

function clearDiv(divId) {
  let part = document.querySelector(`#${divId}`);
  part.innerHTML = "";
}

function createProcesses(id, type, tech) {
  // makeunsaved();
  let indexT = findIndex(id);
  let data = transistorContents[indexT]['data'];
  let processObj = {};
  let processesTab = document.querySelector(`#processes-${id}`);
  processesTab.innerHTML = "";
  let mainPage = document.querySelector(`#main-page-${id}`);
  let processes = [];
  let elemCount = Object.keys(data).length;
  let elementList = [];
  for (item in data) {
    elementList.push(item);
  }
  // 4 is the number of 2 columns elements
  elemCount += 4;
  let row = Math.ceil(elemCount / 3);
  row += 1;
  let elements = "";
  let index = 0;
  let elemRead = 0;
  let fullname = "";
  for (let r = 0; r < row; r++) {
    processes[index] = document.createElement("div");
    processes[index].className = "row";
    processesTab.appendChild(processes[index]);
    let newLine = document.createElement('br');
    for (let e = 0; e < 3 && (elemRead < (elemCount - 4)); e++) {
      let col = 4;
      fullname = elementList[elemRead];
      if (fullname === 'f') {
        processes[index].className = "row border-top border-secondary pt-1";
        processes[index].innerHTML = '<div class="col-12"><h5 class="text-secondary">Optional User Design Inputs</h5></div>';
      }
      let startIndex = 0;
      let sub, symbol;
      startIndex = fullname.indexOf("_");
      if (startIndex != -1) {
        sub = fullname.slice(fullname.indexOf("_") + 1, fullname.length);
        symbol = fullname.slice(0, fullname.indexOf("_"));
      } else {
        sub = -1;
        symbol = fullname;
      }
      if (symbol === 'LE' || symbol === 'BL' || symbol === 'LEXP' || (symbol === 'K' & sub === 'FSPICE0')) {
        col = 8;
        e++;
      }
      let unit = '';
      switch (fullname) {
        case "L_min":
          unit = "(&#181;m)";
          break;
        case "t_ox":
          unit = "(nm)";
          break;
        case "mu_n":
          unit = "(cm<sup>2</sup>&nbsp;&#8725;&nbsp;v.s)"
          break;
        case "Y": 
          unit = "V<sup>1&nbsp;&#8725;&nbsp;2</sup>";
          break;
        case "E_CRIT":
          unit = "(V&nbsp;&#8725;&nbsp;&#181;m)";
          break;
        case "alpha":
          unit = "";
          break;
        case "theta":
          unit = "(V<sup>-1</sup>)";
          break;
        case "n":
          unit = "";
          break;
          case "V_T0": 
          unit = "(V)";
          break;
       case "BL": 
          unit = "(mV&nbsp;&#8725;&nbsp;V)";
          break;
        case "DW": 
          unit = "&#181;m";
          break;
        case  "LEXP": 
          unit = "";
          break;
        case  "DL": 
          unit = "&#181;m";
          break;
        case  "beta": 
          unit = "";
          break;
        case  "K_F0": 
          unit = "(c<sup>2</sup>&nbsp;&#8725;&nbsp;cm<sup>2</sup>)";
          break;
        case  "KP_F0": 
          unit = "(nV<sup>2</sup>.&#181;m<sup>2</sup>)";
          break;
        case  "K_FSPICE0": 
          unit = "(V<sup>2</sup>F)";
          break;
        case  "V_KF": 
          unit = "(V)";
          break;
        case "AF": 
          unit = "";
          break;
        case  "A_VT0": 
          unit = "(mV.&#181;m)";
          break;
        case  "A_KP": 
          unit = "(&#181;m)";
          break;
        case  "V_AL": 
          unit = "(V&nbsp;&#8725;&nbsp;&#181;m)";
          break;
        case  "K": 
          unit = "(j&nbsp;&#8725;&nbsp;&#176;K)";
          break;
        case  "PHI_F": 
          unit = "(V)";
          break;
        case  "f": 
          unit = "(Hz)";
          break;
        case  "T": 
          unit = "(&#176;K)";
          break;
        case "V_DD": 
          unit = "(V)";
          break;
        case  "V_SB": 
          unit = "(V)";
          break;
        case  "V_DS": 
          unit = "(V)";
          break;
        case  "V_sat": 
          unit = "(V)";
          break;
        case  "C_GS0V": 
          unit = "(fF&nbsp;&#8725;&nbsp;&#181;m)";
          break;
        case  "C_GD0V": 
          unit = "(fF&nbsp;&#8725;&nbsp;&#181;m)";
          break;
        case  "C_GB0V": 
          unit = "(fF&nbsp;&#8725;&nbsp;&#181;m)";
          break;
        case  "C_gdi_hat": 
          unit = "";
          break;
      }
      elements = elemBlock(fullname, symbol, sub, id, col, unit);
      if (fullname === 'f') {
        processes[index].innerHTML += '<div class="row">'
        processes[index].innerHTML += elements;
        processes[index].innerHTML += '</div>'
      } else {
        processes[index].innerHTML += elements;
      }
      
      elemRead++;
      if (fullname === 'C_gdi_hat') {
        break;
      }
    }
    index++;
    processesTab.appendChild(newLine);
  }

  for (let el in data) {
    let block = document.querySelector(`#${el}-tab-${id}`);
    let block_inputs = block.querySelectorAll('input');
    let input = block_inputs[0];
    let bar = block_inputs[1];
    let min = data[el]['min'];
    let max = data[el]['max'];
    let value = data[el]['value'];
    processObj[el] = value;
    input.value = value;
    bar.value = (value - min) * 100 / (max - min);
    // Here I should add the event listener that need to update the calculation

    // that will affect the plots.
    input.addEventListener('input', (event) => {
      makeunsaved();
      value = input.value;
      bar.value = (value - min) * 100 / (max - min);
      transistorContents[indexT]["data"][el]["value"] = Number(value);
      calculateDegree(id, type, tech);
      calculateCalculation(id, type, tech);
      calculateSpecification(id, type, tech);
    });
    /*input.addEventListener('input', (event) => {
      value = input.value;
      bar.value = (value - min) * 100 / (max - min);
      // updateDataSetDegree(id, "processes", mainPage);
      transistorContents[indexT]["data"][el]["value"] = Number(value);
      calculateDegree(id, type, tech);
      calculateCalculation(id, type, tech);
      calculateSpecification(id, type, tech);

    });*/
    bar.addEventListener('input', (event) => {
      makeunsaved();
      input.value = (Number(bar.value) * (max - min)) / 100 + min;
      // updateDataSetDegree(id, "processes", mainPage);
      transistorContents[indexT]["data"][el]["value"] = Number(input.value);
      calculateDegree(id, type, tech);
      calculateCalculation(id, type, tech);
      calculateSpecification(id, type, tech);
    });
  }
  return processObj;
}

function fillBodyItems(id, type, tech, item, unit) {
  let subIndex = item.indexOf('_');
  let itemName;;
  let itemNameSub;
  if (subIndex == -1) {
    itemNameSub = '';
    itemName = item;
  } else {
    itemName = item.slice(0, subIndex);
    itemNameSub = item.slice(subIndex + 1, item.length);
  }
  if (item === 'L' || item === 'IC' || item === 'I_D') {
    return `<div class="col-md-4"><input type="checkbox" checked><div class="align-items-center border border-secondary rounded" style="padding-bottom: 15%; background-color: gainsboro;"><div class="container"><div class="row" id="${item}_tab_${id}"><div class="col-2" style="padding-top: 20%; padding-left: 0; float:left;"><span><small>${itemName}<sub>${itemNameSub}</sub>:</small></span></div><div class="col-5 px-0" style="padding-top: 17%;"><input type="text" id="${item}_tab_${id}_textbox" class="form-control mx-0 px-0" style="text-align: center; font-size: 0.8em; padding-left: 0; float: left; margin-left: 0; margin-right: 0;"></div><div class="col-2 px-0" style="float: left; padding-top: 18%"><small class="text-muted"><i>${unit}</i></small></div><div class="col-3"><div class="slider-wrapper"><input type="range" list="tickmarks" id="${item}_bar"><datalist id="tickmarks"><option value="0" label="0%"></option><option value="10"></option><option value="20"></option><option value="30"></option><option value="40"></option><option value="50" label="50%"></option><option value="60"></option><option value="70"></option><option value="80"></option><option value="90"></option><option value="100" label="100%"></option></datalist></div></div></div></div></div></div>`;    
  } else if (item === 'W') {
    return `<div class="col-md-4"><input type="checkbox"><div class="align-items-center border border-secondary rounded" style="padding-bottom: 15%; background-color: gainsboro;"><div class="container"><div class="row" id="${item}_tab_${id}"><div class="col-2" style="padding-top: 20%; padding-left: 0; float:left;"><span><small>${itemName}<sub>${itemNameSub}</sub>:</small></span></div><div class="col-5 px-0" style="padding-top: 17%;"><input type="text" id="${item}_tab_${id}_textbox" class="form-control mx-0 px-0" style="text-align: center; font-size: 0.8em; padding-left: 0; float: left; margin-left: 0; margin-right: 0;"></div><div class="col-2 px-0" style="float: left; padding-top: 18%"><small class="text-muted"><i>${unit}</i></small></div><div class="col-3"><div class="slider-wrapper"><input type="range" list="tickmarks" id="${item}_bar"><datalist id="tickmarks"><option value="0" label="0%"></option><option value="10"></option><option value="20"></option><option value="30"></option><option value="40"></option><option value="50" label="50%"></option><option value="60"></option><option value="70"></option><option value="80"></option><option value="90"></option><option value="100" label="100%"></option></datalist></div></div></div></div></div></div>`;
  } else if (item === 'V_EFF') {
    return `<div class="col-md-4"><input type="checkbox"><div class="align-items-center border border-secondary rounded" style="padding-bottom: 15%; background-color: gainsboro;"><div class="container"><div class="row" id="${item}_tab_${id}"><div class="col-2" style="padding-top: 20%; padding-left: 0; float:left;"><span><small>${itemName}<sub>${itemNameSub}</sub>:</small></span></div><div class="col-5 px-0" style="padding-top: 17%;"><input type="text" id="${item}_tab_${id}_textbox" class="form-control mx-0 px-0" style="text-align: center; font-size: 0.8em; padding-left: 0; float: left; margin-left: 0; margin-right: 0;"></div><div class="col-2 px-0" style="float: left; padding-top: 18%"><small class="text-muted"><i>${unit}</i></small></div><div class="col-3"><div class="slider-wrapper"><input type="range" list="tickmarks" id="${item}_bar"><datalist id="tickmarks"><option value="0" label="0%"></option><option value="10"></option><option value="20"></option><option value="30"></option><option value="40"></option><option value="50" label="50%"></option><option value="60"></option><option value="70"></option><option value="80"></option><option value="90"></option><option value="100" label="100%"></option></datalist></div></div></div></div></div></div>`;
  } else if (item === 'GMdivID') {
    return `<div class="col-md-4"><input type="checkbox"><div class="align-items-center border border-secondary rounded" style="padding-bottom: 15%; background-color: gainsboro;"><div class="container"><div class="row" id="GMdivID_tab_${id}"><div class="col-3" style="padding-top: 20%; padding-left: 0; float:left;"><span><small>G<sub>m</sub>&nbsp;&#8725;&nbsp;I<sub>D</sub>:</small></span></div><div class="col-4 px-0" style="padding-top: 17%;"><input type="text" id="GMdivID_tab_${id}_textbox" class="form-control mx-0 px-0" style="text-align: center; font-size: 0.8em; padding-left: 0; float: left;  margin-left: 0; margin-right: 0;"></div><div class="col-2 px-0" style="float: left; padding-top: 18%"><small class="text-muted"><i>${unit}</i></small></div><div class="col-2"><div class="slider-wrapper"><input type="range" list="tickmarks" id="GMdivID_tab_${id}_bar"><datalist id="tickmarks"><option value="0" label="0%"></option><option value="10"></option><option value="20"></option><option value="30"></option><option value="40"></option><option value="50" label="50%"></option><option value="60"></option><option value="70"></option><option value="80"></option><option value="90"></option><option value="100" label="100%"></option></datalist></div></div></div></div></div></div>`;
  }
}

function generateDegreeBody(id, type, tech) {
  let indexT = findIndex(id);
  let data = transistorContents[indexT]['data'];
  transistorContents[indexT]['activeTab'] = 'degree';

  let degreeBody = document.createElement('div');
  degreeBody.className = "border border-info rounded w-100";
  degreeBody.style = "height: 75vh; padding: 1%;";
  degreeBody.id = `main-page-${id}`;
  
  let degreeBodyRow = document.createElement('div');
  degreeBodyRow.className = "row";
  degreeBody.appendChild(degreeBodyRow);
  let newLine = document.createElement('br');
  
  // pointless somehow; only the declaration is required
  // TODO: The following lines seems to need a really good examination
  let lBox, IC_BOX, I_D_BOX, W_BOX, V_EFF_BOX, GMdivID_BOX;
  lBox = fillBodyItems(id, type, tech, 'L', '(&#181;m)');
  IC_BOX = fillBodyItems(id, type, tech, 'IC', '');
  I_D_BOX = fillBodyItems(id, type, tech, 'I_D', '(&#181;A)');
  W_BOX = fillBodyItems(id, type, tech, 'W', '(&#181;A)');
  V_EFF_BOX = fillBodyItems(id, type, tech, 'V_EFF', '(V)');
  GMdivID_BOX = fillBodyItems(id, type, tech, 'GMdivID', '(V<sup>-1</sup>)');
  degreeBodyRow.innerHTML = lBox;
  degreeBodyRow.innerHTML += IC_BOX;
  degreeBodyRow.innerHTML += I_D_BOX;
  let degreeBodyRow2 = document.createElement('div');
  degreeBodyRow2.className = "row";
  degreeBody.appendChild(newLine);
  degreeBody.appendChild(degreeBodyRow2);
  degreeBodyRow2.innerHTML += W_BOX;
  degreeBodyRow2.innerHTML += V_EFF_BOX;
  degreeBodyRow2.innerHTML += GMdivID_BOX;
  pagesClass.appendChild(degreeBody);
  for (const [i, v] of Object.entries(transistorContents[indexT]['degreeFreedom'])) {
    for (let [j, w] of Object.entries(v)) {
      transistorContents[indexT]['degreeFreedom'][i][j] = Number(w);
    }
  }

  let info = transistorContents[indexT]['degreeFreedom'];
  // c_ox
  let c_ox = 34.5 / data["t_ox"]['value'];
  // U_T
  let U_T = 0.0258 * (data['T']['value'] / 300);
  let I_0;
  if (type === 'nmos')
    I_0 = 2 * data['n']['value'] * data['mu_n']['value'] * c_ox * Math.pow(U_T, 2) / 10;
  else if (type === 'pmos')
    I_0 = 2 * data['n']['value'] * data['mu_p']['value'] * c_ox * Math.pow(U_T, 2) / 10;
  else 
    console.log("-error");
  info['W']['value'] = (info['L']['value'] / info['IC']['value']) * (info['I_D']['value'] / I_0);
  info['V_EFF']['value'] = calculateVEFF(id, info['IC']['value'], info['L']['value']);
  info['GMdivID']['value'] = calculateGMID(id, info['IC']['value'], info['L']['value']);

  for (const [key, value] of Object.entries(info)) {
    let block = document.querySelector(`#${key}_tab_` + id);
    let block_inputs = block.querySelectorAll('input');
    let input = block_inputs[0];
    let bar;
    if (block_inputs.length > 1)
      bar = block_inputs[1];
    let min = info[key]['min'];
    let max = info[key]['max'];
    let value = info[key]['value'];
    input.value = value;
    
    transistorContents[indexT]['degreeBody'] = degreeBody;
    if (block_inputs.length > 1) {
      bar.value = (Number(value) - min) * 100 / (max - min);
      bar.addEventListener('input', (event) => {
        makeunsaved();
        input.value = (Number(bar.value) * (max - min)) / 100 + min;
        // updateDataSetDegree(id, "degreeBody", degreeBody);
        info[key]['value'] = Number(input.value);
        info['W']['value'] = (info['L']['value'] / info['IC']['value']) * (info['I_D']['value'] / I_0);
        info['V_EFF']['value'] = calculateVEFF(id, info['IC']['value'], info['L']['value']);
        info['GMdivID']['value'] = calculateGMID(id, info['IC']['value'], info['L']['value']);
        transistorContents[indexT]['degreeFreedom'] = info;
        if (key !== 'W' || key !== 'V_EFF' || key !== 'GMdivID') {
          updateDegreeDisable(id, type);
        }
        calculateDegree(id, type, tech);
        calculateCalculation(id, type, tech);
        calculateSpecification(id, type, tech);
      });
    }
    
    input.addEventListener('focusout', (event) => {
      makeunsaved();
      value = Number(input.value);
      bar.value = (value - min) * 100 / (max - min);
      // updateDataSetDegree(id, "degreeBody", degreeBody);
      info[key]['value'] = value;
      info['W']['value'] = (info['L']['value'] / info['IC']['value']) * (info['I_D']['value'] / I_0);
      info['V_EFF']['value'] = calculateVEFF(id, info['IC']['value'], info['L']['value']);
      info['GMdivID']['value'] = calculateGMID(id, info['IC']['value'], info['L']['value']);
      transistorContents[indexT]['degreeFreedom'] = info;
      if (key !== 'W' || key !== 'V_EFF' || key !== 'GMdivID') {
        updateDegreeDisable(id, type);
      }
      calculateDegree(id, type, tech);
      calculateCalculation(id, type, tech);
      calculateSpecification(id, type, tech);
    });
  }
  let calculateDraw = document.createElement('div')
  calculateDraw.className = "row mt-5"
  calculateDraw.innerHTML = `<div class="col-4"><button id="submit-${id}" class="btn btn-light border border-primary ml-2" style="width:100px">Run</button></div><div class="col-8"></div>`;
  degreeBody.appendChild(calculateDraw);

  let runBtn = document.querySelector(`#submit-${id}`);
  runBtn.addEventListener('click', () => {
    calculateDegree(id, type, tech);
    calculateCalculation(id, type, tech);
    calculateSpecification(id, type, tech);
    drawHandler(id, tech, type);
  })
  transistorContents[indexT]['degreeFreedom'] = info;
}

function generateCalculationBody(id, type, tech) {
  let mainBody = document.createElement("div");
  mainBody.id = `main-page-${id}`;
  let primaryCalculationObj = document.createElement('div');
  primaryCalculationObj.className = "border border-info rounded w-100";
  primaryCalculationObj.id = `main-page-${id}`;
  primaryCalculationObj.style = "overflow: auto; height: 75vh; padding: 1%;";
  
  let index = 0;
  let rows = [];
  let item = 0;
  let indexTemp = 0;
  let indexT = findIndex(id);
  let data = transistorContents[indexT]['primaryCalculation'];
  for (const [key, value] of Object.entries(data)) {
    if (!(item % 3)) {
      let newLine = document.createElement('br');
      rows[index] = document.createElement("div");
      rows[index].className = "row";
      primaryCalculationObj.appendChild(rows[index]);
      indexTemp = index;
      index++;
      primaryCalculationObj.appendChild(newLine);
    }
    let symbol, subNotation = '';
    if (key.indexOf('_') !== -1) {
      symbol = key.slice(0, key.indexOf('_'));
      subNotation = key.slice(key.indexOf('_') + 1, key.length);
    } else {
      symbol = key.slice(0, key.length);
    }
    let symbolCols = 2;
    let boxCols = 8;
    let unitCols = 1;
    let paran = '';
    let unit = '(error)';
    switch (key) {
      case 'V_T':
        unit = '(V)'
        break;
      case 'c_ox':
        symbolCols = 2;
        boxCols = 7;
        unitCols = 3;
        unit = '(fF&nbsp;&#8725;&nbsp;&#181;m<sup>2</sup>)'
        break;
      case 'U_T':
        unit = '(V)'
        break;
      case 'L_eff':
        unit = '(&#181;m)'
        break;
      case 'V_A':
        unit = '(V)'
        break;
      case 'IC_CRIT':
        unit = '';
        break;
      case 'IC_CRIT_min':
        symbolCols = 3;
        boxCols = 7;
        unitCols = 2;
        unit = ''
        symbol = "IC";
        subNotation = 'CRIT<sub>min</sub>';
        break;
      case 'C_GOX':
        unit = '(fF)'
        break;
      case 'X':
        unit = ''
        break;
      case 'C_gsi_hat':
        symbol = 'C<sup>&#770;</sup>';
        subNotation = 'gsi';
        unit = ''
        break;
      case 'C_gsi':
        symbol = 'C';
        subNotation = 'gsi';
        unit = '(fF)'
        break;
      case 'C_gbi_hat':
        symbol = 'C<sup>&#770;</sup>';
        subNotation = 'gbi';
        unit = ''
        break;
      case 'C_gbi':
        symbol = 'C';
        subNotation = 'gbi';
        unit = '(fF)'
        break;
      case 'k':
        symbolCols = 2;
        boxCols = 7;
        unitCols = 2;
        unit = '(&#181;A&nbsp;&#8725;&nbsp;V<sup>2</sup>)'
        break;
      case 'I_0':
        unit = '(&#181;A)'
        break;
      case 'LE_CRIT_P':
        symbolCols = 4;
        boxCols = 7;
        unitCols = 1;
        symbol = "(LE";
        subNotation = 'CRIT';
        paran = ')&#x2032;';
        unit = '(V)'
        break;
      case 'LE_CRIT_P_min':
        symbolCols = 5;
        boxCols = 6;
        unitCols = 1;
        unit = '(V)';
        symbol = "(LE";
        subNotation = 'CRIT';
        paran = ')&#x2032;<sub>min</sub>';
        break;
      case 'V_A_CLM':
        symbolCols = 3;
        boxCols = 7;
        unitCols = 2;
        unit = '(V)';
        symbol = 'V';
        subNotation = 'A';
        paran = '(CLM)';
        break;
      case 'V_A_DIBL':
        symbolCols = 3;
        boxCols = 7;
        unitCols = 2;
        unit = '(V)';
        symbol = 'V';
        subNotation = 'A';
        paran = '(DIBL)';
        break;
      case 'gamma':
        symbolCols = 2;
        boxCols = 7;
        unitCols = 2;
        symbol = '&#915;';
        unit = ''
        break;
      case 'B':
        unit = ''
        break;
      case 'A':
        unit = ''
        break;
      case 'Kp_F':
        symbolCols = 2;
        boxCols = 7;
        unitCols = 2;
        symbol = 'K&#8242;';
        unit = '(nV<sup>2</sup>.&#181;m<sup>2</sup>)';
        break;
      case 'K_F':
        symbolCols = 2;
        boxCols = 7;
        unitCols = 2;
        unit = '(c<sup>2</sup>&nbsp;&#8725;&nbsp;cm<sup>2</sup>)';
        break;
      case 'W_eff':
        unit = '(&#181;m)';
        break;
      case 'PHI_0':
        symbol = '&#966;';
        unit = '(V)';
        break;
      case 'AV_T':
        symbolCols = 2;
        boxCols = 7;
        unitCols = 2;
        unit = '(mV.&#181;m)';
        break;
      case 'eta':
        symbol = '&#951;';
        unit = '';
        break;
      case 'V_GS':
        unit = '(V)';
        break;
      case 'K_GA':
        symbolCols = 2;
        boxCols = 6;
        unitCols = 4;
        unit = '(A&nbsp;&#8725;&nbsp;&#181;m<sup>2</sup>V<sup>2</sup>)';
        break;
      case 'K_GB':
        symbolCols = 2;
        boxCols = 6;
        unitCols = 4;
        unit = '(V<sup>-1</sup>)';
        break;
      case 'L_sat':
        symbolCols = 2;
        boxCols = 7;
        unitCols = 2;
        unit = '(&#181;m)'
        break;
      case 'L_c':
        symbolCols = 2;
        boxCols = 7;
        unitCols = 2;
        symbol = 'L<sub>c</sub>';
        unit = ''
        break;
      case 'Lambda_c':
        symbol = '&lambda;'
        subsymbol = 'c';
        symbolCols = 2;
        boxCols = 7;
        unitCols = 2;
        unit = ''
        break;
      case 'C_gdi':
        symbol = 'C'
        subsymbol = 'gdi';
        symbolCols = 2;
        boxCols = 7;
        unitCols = 2;
        unit = '(&#181;f)'
        break;
      case 'C_gso':
        symbol = 'C'
        subsymbol = 'gso';
        symbolCols = 2;
        boxCols = 7;
        unitCols = 2;
        unit = '(&#181;f)'
        break;
      case 'C_gdo':
        symbol = 'C'
        subsymbol = 'gdo';
        symbolCols = 2;
        boxCols = 7;
        unitCols = 2;
        unit = '(&#181;f)'
        break;
      case 'C_gbo':
        symbol = 'C'
        subsymbol = 'gbo';
        symbolCols = 2;
        boxCols = 7;
        unitCols = 2;
        unit = '(&#181;f)'
        break;
      case 'C_gs':
        symbol = 'C'
        subsymbol = 'gs';
        symbolCols = 2;
        boxCols = 7;
        unitCols = 2;
        unit = '(&#181;f)'
        break;
      case 'C_gd':
        symbol = 'C'
        subsymbol = 'gd';
        symbolCols = 2;
        boxCols = 7;
        unitCols = 2;
        unit = '(&#181;f)'
        break;
      case 'C_gb':
        symbol = 'C'
        subsymbol = 'gb';
        symbolCols = 2;
        boxCols = 7;
        unitCols = 2;
        unit = '(&#181;f)'
        break;
    }
    let itemBody = `<div class="col-md-4"><div class="align-items-center border border-secondary rounded" style="padding-bottom: 15%; background-color: gainsboro;"><div class="container"><div class="row" id="${key}-item"><div class="col-${symbolCols}" style="padding-top: 20%; padding-left: 0; float:left;"><span><small>${symbol}<sub>${subNotation}</sub>${paran}:</small></span></div><div class="col-${boxCols} px-0" style="padding-top: 17%;"><input type="text" id="${key}-item-textbox" class="form-control mx-0 px-0" style="text-align: center; font-size: 0.8em; padding-left: 0; float; left" readonly></div><div class="col-${unitCols} px-0" style="float: left; padding-top: 18%"><small class="text-muted"><i>${unit}</i></small></div></div></div></div></div>`;
    rows[indexTemp].innerHTML += itemBody;
    item++;

  }

  mainBody = primaryCalculationObj;
  pagesClass.appendChild(mainBody);
  
  for (const [key, value] of Object.entries(data)) {
    let input = document.querySelector(`#${key}-item-textbox`);
    let textValue = value;
    input.value = textValue;
    // transistorContents[indexT]['primaryCalculation'] = primaryCalculationObj;
  }
  // transistorContents[indexT]["activePage"] = "primaryCalculation";
}

function generateSpecificationBody(id, type, tech) {
  let description = {"W": "Sizing Relationships", "V_EFF": "DC Bias Parameters", "GMdivID": "Small Signal Parameters", "V_A": "Gain and Bandwidth Relationships", "S_VG": "Gate Referred Thermal & Flicker Noise ", "DV_T": "Local Area DC Mismatch", 'I_GSL': "Gate-source Leakage Current", 'GMIDFT': "Figure of Merits"}
  let paraph;
  let indexT = findIndex(id);
  let data = transistorContents[indexT]['specification'];
  let mainBody = document.createElement("div");
  mainBody.id = `main-page-${id}`;

    let specification = document.createElement('div');
    specification.className += "border border-info rounded w-100";
    specification.id = `main-page-${id}`;
    specification.style = "overflow: auto; height: 75vh; padding: 1%;";
  
    let index = 0;
    let rows = [];
    let item = 0;
    let indexTemp = 0;
    for (const [key, value] of Object.entries(data)) {
      if (key === "W" || key === "V_EFF" || key === "GMdivID" || key === "V_A" || key === "S_VG" || key === "DV_T" || key === 'I_GSL' || key === 'GMIDFT') {
        item = 0;
        let newLine = document.createElement('br');
        rows[index] = document.createElement("div");
        rows[index].className = "row";
        specification.appendChild(rows[index]);
        paraph = `<div class="col-md-12 border-top border-secondary"><h5 class="text-secondary pt-4">${description[key]}</h5></div>`
        rows[index].innerHTML = paraph;
        specification.appendChild(newLine);
        index++;
      }
      if (!(item % 3)) {
        let newLine = document.createElement('br');
        rows[index] = document.createElement("div");
        rows[index].className = "row";
        specification.appendChild(rows[index]);
        indexTemp = index;
        index++;
        specification.appendChild(newLine);
      }
      let subNtotation = key.indexOf('_') !== -1 ? key.slice(key.indexOf('_') + 1, key.length) : "";;
      let symbol = key.indexOf('_') !== -1 ? key.slice(0, key.indexOf('_')) : key.slice(0, key.length);

      let itemBody;
      let paran = '';
      if (symbol === 'S' && subNtotation === 'VGF') {
        symbol = 'S';
        subNtotation = 'VG';
        paran = '(f)';
      }
      if (symbol === 'A' && subNtotation === '1dBWI') {
        symbol = 'A';
        subNtotation = '1dB';
        paran = '(WI)';
      }
      if (symbol === 'A' && subNtotation === '1dBSI') {
        symbol = 'A';
        subNtotation = '1dB';
        paran = '(SI)';
      }
      switch (subNtotation) {
        case 'DS':
          subNtotation = 'DS<sub>sat</sub>'
          break;
        case 'GS':
          symbol = '&#8710;V';
          subNtotation = 'GS';
          break;
        case 'T0':
          symbol = '&#8710;V';
          subNtotation = 'T0';
          break;
      }
      switch (symbol) {
        case 'GMdivID':
          symbol = 'g<sub>m</sub>divI<sub>D</sub>';
          break;
        case 'GDSdivID':
          symbol = 'g<sub>ds</sub>divI<sub>D</sub>';
          break;
        case 'DIDdivID':
          symbol = '&#8710;I<sub>D</sub>divI<sub>D</sub>';
          break;
        case 'DKpdivKp':
          symbol = '&#8710;K<sub>P</sub>divK<sub>P</sub>';
          break;
      }
      let unit = '(error)';
      switch (key) {
        case 'W':
          unit = '(&#181;m)';
          break;
        case 'WL':
          unit = '(&#181;m<sup>2</sup>)';
          break;
        case 'WdivL':
          unit = '';
          break;
        case 'V_EFF':
          unit = '(V)';
          break;
        case 'V_DS':
          unit = '(V)';
          break;
        case 'GMdivID':
          unit = '(V<sup>-1</sup>)';
          break;
        case 'GDSdivID':
          unit = '(V<sup>-1</sup>)';
          break;
        case 'V_A':
          unit = '(V)';
          break;
        case 'AV_i':
          unit = '';
          break;
        case 'fT_i':
          unit = '(GHz)';
          break;
        case 'S_VG':
          unit = '(nV<sup>2</sup>&nbsp;&#8725;&nbsp;Hz)';
          break;
        case 'S_VGF':
          unit = '(nV<sup>2</sup>&nbsp;&#8725;&nbsp;Hz)';
          break;
        case 'S_VG_sqrt':
          unit = '(nV&nbsp;&#8725;&nbsp;&#8730;Hz)';
          symbol = '&#8730;S'
          subNtotation = 'VG';
          break;
        case 'S_VGF_sqrt':
          unit = '(nV&nbsp;&#8725;&nbsp;&#8730;Hz)';
          symbol = '&#8730;S'
          subNtotation = 'VG';
          paran = '(f)'
          break;
        case 'f_c':
          unit = '(GHz)';
          break;
        case 'f_T':
          unit = '(GHz)';
          break;
        case 'f_Tr':
          symbol = 'f';
          subNotation = 'Tr'
          unit = '(GHz)';
          break;
        case 'DV_T':
          unit = '(mV)';
          symbol = '&#8710;V';
          break;
        case 'DKpdivKp':
          unit = '(%)';
          break;
        case 'DV_GS':
          unit = '(mV)';
          break;
        case 'DIDdivID':
          unit = '(%)';
          break;
        case 'g_m':
          unit = '(&#181;s)';
          break;
        case 'g_ds':
          unit = '(&#181;s)';
          break;
        case 'g_mb':
          unit = '(&#181;s)';
          break;
        case 'r_ds':
          unit = '(K&#8486;)';
          break;
        case 'A_1dBWI':
          unit = '(V)';
          break;
        case 'A_1dBSI':
          unit = '(V)';
          break;
        case 'I_GSL':
          unit = '(&#181;A)';
          symbol = 'I';
          subNtotation = '(GS)L';
          break;
        case 'GMIDFT':
          unit = 'V<sup>-1</sup>GHz';
          symbol = 'g<sub>m</sub>&nbsp;&#8725;&nbsp;I<sub>D</sub>.f<sub>Ti</sub>';
          break;
        case 'AVIFTI':
          unit = 'GHz';
          symbol = 'AV<sub>i</sub>.f<sub>Ti</sub>';
          break;
      }
      // TODO: These if and elses should be removed after puting some 
      if (symbol.indexOf('div') !== -1) {
        itemBody = `<div class="col-md-4"><div class="align-items-center border border-secondary rounded" style="padding-bottom: 15%; background-color: gainsboro;"><div class="container"><div class="row" id="${key}-item-${id}"><div class="col-2" style="padding-top: 20%; padding-left: 0; float:left;"><span><small>${symbol.slice(0, symbol.indexOf('div'))}&nbsp;&#8725;&nbsp;${symbol.slice(symbol.indexOf('div') + 3, symbol.length)}:</small></span></div><div class="col-8 px-0" style="padding-top: 17%;"><input type="text" id="${key}-item-textbox" class="form-control mx-0" style="text-align: center; font-size: 0.8em; padding-left: 0; float; left" readonly></div><div class="col-1 px-0" style="float: left; padding-top: 18%"><small class="text-muted"><i>${unit}</i></small></div></div></div></div></div>`;
        if (key === 'GMdivID' || key === 'GDSdivID') {
          itemBody = `<div class="col-md-4"><div class="align-items-center border border-secondary rounded" style="padding-bottom: 15%; background-color: gainsboro;"><div class="container"><div class="row" id="${key}-item-${id}"><div class="col-3" style="padding-top: 20%; padding-left: 0; float:left; "><span><small>${symbol.slice(0, symbol.indexOf('div'))}&nbsp;&#8725;&nbsp;${symbol.slice(symbol.indexOf('div') + 3, symbol.length)}:</small></span></div><div class="col-7 px-0" style="padding-top: 17%;"><input type="text" id="${key}-item-textbox" class="form-control mx-0" style="text-align: center; font-size: 0.8em; padding-left: 0; float; left" readonly></div><div class="col-2 px-0" style="float: left; padding-top: 18%"><small class="text-muted"><i>${unit}</i></small></div></div></div></div></div>`;
        } else if (key === 'DIDdivID' || key === 'DKpdivKp') {
          itemBody = `<div class="col-md-4"><div class="align-items-center border border-secondary rounded" style="padding-bottom: 15%; background-color: gainsboro;"><div class="container"><div class="row" id="${key}-item-${id}"><div class="col-3" style="padding-top: 20%; padding-left: 0; float:left;"><span><small>${symbol.slice(0, symbol.indexOf('div'))}&nbsp;&#8725;&nbsp;${symbol.slice(symbol.indexOf('div') + 3, symbol.length)}:</small></span></div><div class="col-7 px-0" style="padding-top: 17%;"><input type="text" id="${key}-item-textbox" class="form-control mx-0" style="text-align: center; font-size: 0.8em; padding-left: 0; float; left" readonly></div><div class="col-1 px-0" style="float: left; padding-top: 18%"><small class="text-muted"><i>${unit}</i></small></div></div></div></div></div>`;
        }
      } else {
        itemBody = `<div class="col-md-4"><div class="align-items-center border border-secondary rounded" style="padding-bottom: 15%; background-color: gainsboro;"><div class="container"><div class="row" id="${key}-item-${id}"><div class="col-2" style="padding-top: 20%; padding-left: 0; float:left;"><span><small>${symbol}<sub>${subNtotation}</sub>${paran}:</small></span></div><div class="col-8 px-0" style="padding-top: 17%;"><input type="text" id="${key}-item-textbox" class="form-control mx-0" style="text-align: center; font-size: 0.8em; padding-left: 0; float; left" readonly></div><div class="col-2 px-0" style="float: left; padding-top: 18%"><small class="text-muted"><i>${unit}</i></small></div></div></div></div></div>`;
        if (key === 'S_VG' || key === 'S_VGF') {
          itemBody = `<div class="col-md-4"><div class="align-items-center border border-secondary rounded" style="padding-bottom: 15%; background-color: gainsboro;"><div class="container"><div class="row" id="${key}-item-${id}"><div class="col-2" style="padding-top: 20%; padding-left: 0; float:left;"><span><small>${symbol}<sub>${subNtotation}</sub>${paran}:</small></span></div><div class="col-7 px-0" style="padding-top: 17%;"><input type="text" id="${key}-item-textbox" class="form-control mx-0" style="text-align: center; font-size: 0.8em; padding-left: 0; float; left" readonly></div><div class="col-2 px-0" style="float: left; padding-top: 18%"><small class="text-muted"><i>${unit}</i></small></div></div></div></div></div>`;
        } else if (symbol === 'A') {
          itemBody = `<div class="col-md-4"><div class="align-items-center border border-secondary rounded" style="padding-bottom: 15%; background-color: gainsboro;"><div class="container"><div class="row" id="${key}-item-${id}"><div class="col-3" style="padding-top: 20%; padding-left: 0; float:left;"><span><small>${symbol}<sub>${subNtotation}</sub>${paran}:</small></span></div><div class="col-7 px-0" style="padding-top: 17%;"><input type="text" id="${key}-item-textbox" class="form-control mx-0" style="text-align: center; font-size: 0.8em; padding-left: 0; float; left" readonly></div><div class="col-2 px-0" style="float: left; padding-top: 18%"><small class="text-muted"><i>${unit}</i></small></div></div></div></div></div>`;
        } else if (key === 'S_VG_sqrt' || key === 'S_VGF_sqrt' || key === 'GMIDFT' || key === 'AVIFTI') {
          itemBody = `<div class="col-md-4"><div class="align-items-center border border-secondary rounded" style="padding-bottom: 15%; background-color: gainsboro;"><div class="container"><div class="row" id="${key}-item-${id}"><div class="col-3" style="padding-top: 20%; padding-left: 0; float:left;"><span><small>${symbol}<sub>${subNtotation}</sub>${paran}:</small></span></div><div class="col-6 px-0" style="padding-top: 17%;"><input type="text" id="${key}-item-textbox" class="form-control mx-0" style="text-align: center; font-size: 0.8em; padding-left: 0; float; left" readonly></div><div class="col-3 px-0" style="float: left; padding-top: 18%"><small class="text-muted"><i>${unit}</i></small></div></div></div></div></div>`;
        }
      }
      rows[indexTemp].innerHTML += itemBody;
      item++;
    }
    mainBody = specification;
    pagesClass.appendChild(mainBody);
    
    for (const [key, value] of Object.entries(data)) {
      let input = document.querySelector(`#${key}-item-textbox`);
      let textValue = value;
      input.value = textValue;
      // transistorContents[tabSelectedNumber - 1]['specificationContent'] = specification;
    }
  // transistorContents[tabSelectedNumber - 1]["activePage"] = "specificationContent";
}

function fillTransistorBody(id, tab) {}


function updateDegreeDisable(id, type) {
  const index = findIndex(id);
  const data = transistorContents[index]['data'];
  let info = transistorContents[index]['degreeFreedom'];
  let L = info['L']['value'];

  // c_ox
  let c_ox = 34.5 / data["t_ox"]['value'];
  let U_T = 0.0258 * (data['T']['value'] / 300);
  let I_0;
    if (type === 'nmos')
      I_0 = 2 * data['n']['value'] * data['mu_n']['value'] * c_ox * Math.pow(U_T, 2) / 10;
    else if (type === 'pmos')
      I_0 = 2 * data['n']['value'] * data['mu_p']['value'] * c_ox * Math.pow(U_T, 2) / 10;
    else 
      console.log("-error");
  
  let W = (info['L']['value'] / info['IC']['value']) * (info['I_D']['value'] / I_0);
  let LE_CRIT_P = (data["theta"]['value'] * L * data["E_CRIT"]['value']) / (data["theta"]['value'] + L * data["E_CRIT"]['value']);
  let IC = info['IC']['value'];
  let IC_CRIT = Math.pow(LE_CRIT_P / (4 * data["n"]['value'] * U_T), 2);
  let B = IC * (1 + (IC / IC_CRIT));
  let GMdivID = calculateGMID(id, info['IC']['value'], info['L']['value']);
  let VEFF = calculateVEFF(id, IC, L);
  let W_input = document.querySelector(`#W_tab_${id}_textbox`);
  let VEFF_input = document.querySelector(`#V_EFF_tab_${id}_textbox`);
  let GMdivID_input = document.querySelector(`#GMdivID_tab_${id}_textbox`);
  W_input.value = W;
  VEFF_input.value = VEFF;
  GMdivID_input.value = GMdivID;
}

function elemBlock(fullName, symbol, sub, id, col, unit) {
  switch(fullName) {
    case 'mu_n':
      symbol = '&#181;';
      break;
    case 'mu_p':
      symbol = '&#181;';
      break;
    case 'theta':
      symbol = '&#952;';
      break;
    case 'beta':
      symbol = '&#946;';
      break;
    case 'alpha':
      symbol = '&#945;';
      break;
    case 'PHI_F':
      symbol = '&#966;';
      break;
    case 'BL':
      symbol = 'DVT';
      sub = 'DIBL';
      break;
    case 'LEXP':
      symbol = 'DVT';
      sub = 'DIBLEXP';
      break;
    case 'Y':
      symbol = '&#611;';
      break;
    case 'L':
      unit = "(&#181;m)";
      break;
    case 'IC':
      unit = "";
      break;
    case 'I_D':
      unit = "(&#181;A)";
      break;
    case 'W':
      unit = "(&#181;m)";
      break;
    case 'V_EFF':
      unit = '(V)';
      break;
    case 'GMdivID':
      unit = '(V<sup>-1</sup>)';
      break;
    case 'KP_F0':
      symbol ='K&#8242;';
      break;
    case 'C_gdi_hat':
      symbol = 'C<sup>&#770;</sup>';
      sub = 'gd<sub>i</sub>';
      break;
    case 'f_0':
      symbol = 'f';
      sub = '0';
      unit = '(GHz)'
      break; 
  }
  let elements = `<div class="col-md-${col}"><div class="align-items-center border border-secondary rounded" style="padding-bottom: 15%; background-color: gainsboro;"><div class="container"><div class="row" id="t_ox"><div class="col-2" style="padding-top: 20%; padding-left: 0; float:left;"><span><small>t<sub>ox</sub>:</small></span></div><div class="col-5 px-0" style="padding-top: 17%;"><input type="text" id="t_ox_textbox" class="form-control mx-0 px-0" style="text-align: center; font-size: 0.8em; padding-left: 0; float: left; margin-left: 0; margin-right: 0;"></div><div class="col-2 px-0" style="float: left; padding-top: 18%"><small class="text-muted"><i>${unit}</i></small></div><div class="col-3"><div class="slider-wrapper"><input type="range" list="tickmarks" id="t_ox_bar"><datalist id="tickmarks"><option value="0" label="0%"></option><option value="10"></option><option value="20"></option><option value="30"></option><option value="40"></option><option value="50" label="50%"></option><option value="60"></option><option value="70"></option><option value="80"></option><option value="90"></option><option value="100" label="100%"></option></datalist></div></div></div></div></div></div>`;

  if (fullName === 'W' || fullName === 'V_EFF') {
    elements = `<div class="col-md-${col}"><input type="checkbox"><div class="align-items-center border border-secondary rounded" style="padding-bottom: 15%; background-color: gainsboro;"><div class="container"><div class="row" id="t_ox"><div class="col-2" style="padding-top: 20%; padding-left: 0; float:left;"><span><small>t<sub>ox</sub>:</small></span></div><div class="col-5 px-0" style="padding-top: 17%;"><input type="text" id="t_ox_textbox" class="form-control mx-0 px-0" style="text-align: center; font-size: 0.8em; padding-left: 0; float: left; margin-left: 0; margin-right: 0;"></div><div class="col-2 px-0" style="float: left; padding-top: 18%"><small class="text-muted"><i>${unit}</i></small></div><div class="col-3"><div class="slider-wrapper"><input type="range" list="tickmarks" id="t_ox_bar"><datalist id="tickmarks"><option value="0" label="0%"></option><option value="10"></option><option value="20"></option><option value="30"></option><option value="40"></option><option value="50" label="50%"></option><option value="60"></option><option value="70"></option><option value="80"></option><option value="90"></option><option value="100" label="100%"></option></datalist></div></div></div></div></div></div>`;
  }
  if (fullName === 'L' || fullName === 'IC' || fullName === 'I_D') {
    elements = `<div class="col-md-${col}"><input type="checkbox" checked><div class="align-items-center border border-secondary rounded" style="padding-bottom: 15%; background-color: gainsboro;"><div class="container"><div class="row" id="${fullName}_tab_${id}"><div class="col-2" style="padding-top: 20%; padding-left: 0; float:left;"><span><small>t<sub>ox</sub>:</small></span></div><div class="col-5 px-0" style="padding-top: 17%;"><input type="text" id="t_ox_textbox" class="form-control mx-0 px-0" style="text-align: center; font-size: 0.8em; padding-left: 0; float: left; margin-left: 0; margin-right: 0;"></div><div class="col-2 px-0" style="float: left; padding-top: 18%"><small class="text-muted"><i>${unit}</i></small></div><div class="col-3"><div class="slider-wrapper"><input type="range" list="tickmarks" id="t_ox_bar"><datalist id="tickmarks"><option value="0" label="0%"></option><option value="10"></option><option value="20"></option><option value="30"></option><option value="40"></option><option value="50" label="50%"></option><option value="60"></option><option value="70"></option><option value="80"></option><option value="90"></option><option value="100" label="100%"></option></datalist></div></div></div></div></div></div>`;
  }
  if (symbol === 'LE' || symbol === 'DVT' || symbol === 'BL' || (symbol === 'K' && sub === 'FSPICE0')) {
    elements = `<div class="col-sm-${col}"><div class="align-items-center border border-secondary rounded" style="padding-bottom: 7%; background-color: gainsboro;"><div class="container"><div class="row" id="t_ox"><div class="col-2" style="padding-top: 10%; padding-left: 0; float:left;"><span><small>t<sub>ox</sub>:</small></span></div><div class="col-8 px-0" style="padding-top: 8%;"><input type="text" id="t_ox_textbox" class="form-control mx-0 pr-0 pl-0" style="text-align: center; font-size: 0.8em; padding-left: 0; padding-right: 0; float: left"></div><div class="col-1 px-0" style="float: left; padding-top: 9%"><small class="text-muted"><i>${unit}</i></small></div><div class="col-1"><div class="slider-wrapper-8"><input type="range" list="tickmarks" id="t_ox_bar"><datalist id="tickmarks"><option value="0" label="0%"></option><option value="10"></option><option value="20"></option><option value="30"></option><option value="40"></option><option value="50" label="50%"></option><option value="60"></option><option value="70"></option><option value="80"></option><option value="90"></option><option value="100" label="100%"></option></datalist></div></div></div></div></div></div>`;
    // elements = elements.replaceAll("t_ox", fullName + "_tab_" + tabSelectedNumber);
  }
  elements = elements.replaceAll("t_ox", `${fullName}-tab-${id}`);
  elements = elements.replace(">t<sub>", ">"+symbol+"<sub>");
  if (sub != -1)
    elements = elements.replace("ox</sub>", sub + "</sub>");
  else
    elements = elements.replace("ox</sub>", "</sub>");
  if (symbol === 'LE' && sub === 'CRIT') {
    elements = elements.replace("LE<sub>", "(LE<sub>");
    elements = elements.replace("</sub>", "</sub>)&#8242;");
  }
  return elements;
}

function makeNavBarTabsDeactive(id) {
  let navbar = document.querySelector('#' + id);
  let tabs = navbar.querySelectorAll('li');
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].style = "background-color: hsl(204deg 10% 90%)";
    tabs[i].className = "nav-item";
  }
}

function updateDataSetDegree(id, nameTag, Body) {
  let index = findIndex(id);
  transistorContents[index][nameTag] = Body;
}

let chartNumber = 1;
let rowChart = 1;
var chart = [];

function clearCharts() {
  let second_page = document.querySelector('#second-page-row');
  second_page.innerHTML = '<div class="row mb-4"><div class="col-12"><center><small style="color: #00356b; font-weight: bold;">Graphical Analysis</small></center></div></div>';
}

let execlist = []
function drawHandler(id, tech, type) {
  clearCharts();
  let second_page = document.querySelector('#second-page-row');
  second_page.firstChild.style = 'opacity: 10%';

  // setTimeout(() => {
      createChart(id, tech, type);
  // }, 10);
}

let ch1 ,ch2 ,ch3 ,ch4 ,ch5 ,ch6 ,ch7 ,ch8 ,ch9 ,ch10 ,ch11 ,ch12 ,ch13 ,ch14 ,ch15 ,ch16 ,ch17 ,ch18 ,ch19;
function createChart(id, tech, type) {
  let index = findIndex(id);
  chartNumber = 1;
  rowChart = 1;
  chart = [];
  specificationCalculationChart(id, tech, type);

  /*
   Draw charts in order and based on the first argument
   for the lable of the y axis and the second argumet for 
   the data
  */
   if (typeof ch1 === 'number') {
    clearTimeout(ch1);
    ch1 = undefined
  }
  if (typeof ch2 === 'number') {
    clearTimeout(ch2);
    ch2 = undefined
  }
  if (typeof ch3 === 'number') {
    clearTimeout(ch3);
    ch3 = undefined
  }
  if (typeof ch4 === 'number') {
    clearTimeout(ch4);
    ch4 = undefined
  }
  if (typeof ch5 === 'number') {
    clearTimeout(ch5);
    ch5 = undefined
  }
  if (typeof ch6 === 'number') {
    clearTimeout(ch6);
    ch6 = undefined
  }
  if (typeof ch7 === 'number') {
    clearTimeout(ch7);
    ch7 = undefined
  }
  if (typeof ch8 === 'number') {
    clearTimeout(ch8);
    ch8 = undefined
  }
  if (typeof ch9 === 'number') {
    clearTimeout(ch9);
    ch9 = undefined
  }
  if (typeof ch10 === 'number') {
    clearTimeout(ch10);
    ch10 = undefined
  }
  if (typeof ch11 === 'number') {
    clearTimeout(ch11);
    ch11 = undefined
  }
  if (typeof ch12 === 'number') {
    clearTimeout(ch12);
    ch12 = undefined
  }
  if (typeof ch13 === 'number') {
    clearTimeout(ch13);
    ch13 = undefined
  }
  if (typeof ch14 === 'number') {
    clearTimeout(ch14);
    ch14 = undefined
  }
  if (typeof ch15 === 'number') {
    clearTimeout(ch15);
    ch15 = undefined
  }
  if (typeof ch16 === 'number') {
    clearTimeout(ch16);
    ch16 = undefined
  }
  if (typeof ch17 === 'number') {
    clearTimeout(ch17);
    ch17 = undefined
  }
  if (typeof ch18 === 'number') {
    clearTimeout(ch18);
    ch18 = undefined
  }
  if (typeof ch19 === 'number') {
    clearTimeout(ch19);
    ch19 = undefined
  }

  ch1 = setTimeout(() => {
      drawChart('WL', transistorContents[index]['specificationChart']['WL'], index);
  }, 0);

  ch2 = setTimeout(() => {
      drawChart("WdivL", transistorContents[index]['specificationChart']['WdivL'], index);
  }, 0);

  ch3 = setTimeout(() => {
      drawChart("V_EFF", transistorContents[index]['specificationChart']['V_EFF'], index);
  }, 0);

  ch4 = setTimeout(() => {
      drawChart('V_DS', transistorContents[index]['specificationChart']['V_DS'], index);
  }, 0);

  ch5 = setTimeout(() => {
      drawChart("GMdivID", transistorContents[index]['specificationChart']['GMdivID'], index);
  }, 0);

  ch6 = setTimeout(() => {
      drawChart("AV_i", transistorContents[index]['specificationChart']['AV_i'], index);
  }, 0);

  ch7 = setTimeout(() => {
      drawChart("fT_i", transistorContents[index]['specificationChart']['fT_i'], index);
  }, 0);

  ch8 = setTimeout(() => {
      drawChart("gamma", transistorContents[index]['specificationChart']['gamma'], index);
  }, 0);

  ch9 = setTimeout(() => {
      drawChart("S_VG", transistorContents[index]['specificationChart']['S_VG'], index);
  }, 0);

  ch10 = setTimeout(() => {
      drawChart("S_VG_sqrt", transistorContents[index]['specificationChart']['S_VG_sqrt'], index);
  }, 0);

  ch11 = setTimeout(() => {
      drawChart("S_VGF", transistorContents[index]['specificationChart']['S_VGF'], index);
  }, 0);

  ch12 = setTimeout(() => {
      drawChart("S_VGF_sqrt", transistorContents[index]['specificationChart']['S_VGF_sqrt'], index);
  }, 0);

  ch13 = setTimeout(() => {
     drawChart("f_c", transistorContents[index]['specificationChart']['f_c'], index);
  }, 0);

  ch14 = setTimeout(() => {
      drawChart("DV_T", transistorContents[index]['specificationChart']['DV_T'], index);
  }, 0);

  ch15 = setTimeout(() => {
      drawChart("DKpdivKp", transistorContents[index]['specificationChart']['DKpdivKp'], index);
  }, 0);

  ch16 = setTimeout(() => {
      drawChart("DV_GS", transistorContents[index]['specificationChart']['DV_GS'], index);
  }, 0);

  ch17 = setTimeout(() => {
      drawChart("DIDdivID", transistorContents[index]['specificationChart']['DIDdivID'], index);
  }, 0);

  ch18 = setTimeout(() => {
      drawChart("GMIDFT", transistorContents[index]['specificationChart']['GMIDFT'], index);
  }, 0);

  ch19 = setTimeout(() => {
      drawChart("AVIFTI", transistorContents[index]['specificationChart']['AVIFTI'], index);
  }, 0);

  // drawChart("whole", transistorContents[tabSelectedNumber - 1]['specificationChart']);
  let second_page = document.querySelector('#second-page-row');
  second_page.firstChild.style = 'opacity: 100%';
  transistorContents[index]['charts'] = second_page.innerHTML;
}


//x²
/*
  Draw two charts; one a normal chart and the logarithmic form of y axis
 */
function drawChart(xName, value, index) {
  let fullName = 'symb';
  let legend = 'symblegend'
  switch (xName) {
    case 'WL':
      fullName = 'WL';
      legend = 'WL';
      break;
    case 'WdivL':
      fullName = 'W/L';
      legend = 'W/L';
      break;
    case 'V_EFF':
      fullName = 'Veff';
      legend = 'Veff';
      break;
    case 'V_DS':
      fullName = 'Vds';
      legend = 'Vds';
      break;
    case 'GMdivID':
      fullName = 'g<sub>m</sub>/I<sub>D</sub>';
      legend = 'Gm/Id';
      break;
    case 'AV_i':
      fullName = 'AVi';
      legend = 'AVi';
      break;
    case 'fT_i':
      fullName = 'fTi';
      legend = 'fTi';
      break;
    case 'gamma':
      fullName = 'Γ';
      legend = 'Γ';
      break;
    case 'S_VG':
      fullName = 'S<sub>VG</sub>';
      legend = 'Svg';
      break;
    case 'S_VGF':
      fullName = 'S<sub>VG</sub>(f)';
      legend = 'Svg(f)';
      break;
    case 'S_VG_sqrt':
      fullName = '&#8730;S<sub>VG</sub>';
      legend = '√Svg';
      break;
    case 'S_VGF_sqrt':
      fullName = '&#8730;S<sub>VG</sub>(f)';
      legend = '√Svg(f)';
      break;
    case 'f_c':
      fullName = 'f<sub>c</sub>';
      legend = 'Fc';
      break;
    case 'DV_GS':
      fullName = '∆VGS';
      legend = '∆VGS';
      break;
    case 'DKpdivKp':
      fullName = '&#8710;K<sub>P</sub>/K<sub>p</sub>';
      legend = '∆Kp/√WL';
      break;
    case 'GDSdivID':
      fullName = 'g<sub>ds</sub>/I<sub>D</sub>';
      legend = 'Gds</sub>/I<sub>D</sub>';
      break;
    case 'DIDdivID':
      fullName = '∆ID/ID';
      legend = '∆ID/ID';
      break;
    case 'DV_T':
      fullName = '&#8710;V<sub>T</sub>';
      legend = '∆Vₜ';
      break;
    case 'I_GSL':
      fullName = 'I<sub>(GS)L</sub>';
      legend = 'I(gs)L';
      break;
    case 'GMIDFT':
      fullName = 'g<sub>m</sub>&nbsp;&#8725;&nbsp;I<sub>D</sub>.f<sub>Ti</sub>';
      legend = 'Gm/Id.fTi';
      break;
    case 'AVIFTI':
      fullName = 'AV<sub>i</sub>.f<sub>Ti</sub>';
      legend = 'AVi.fTi';
      break;
  }


  let second_page = document.querySelector('#second-page-row');
  let paraph = document.createElement('small');
  let newLine = document.createElement('br');
  // paraph.innerHTML = xName;
  paraph.innerHTML = fullName;
  paraph.class = "small";
  let newRow;
  if ((chartNumber % 2)) {
    newRow = document.createElement('div');
    // newRow.className = "row mb-2 pb-2 px-2 border-bottom border-secondary";
    newRow.className = "row mb-2 pb-2 px-2";
    newRow.id = `row-${rowChart}`;
    second_page.appendChild(paraph);
    second_page.appendChild(newRow);
    rowChart++;
  } else {
    newRow = document.querySelector(`#row-${rowChart - 1}`);
  }

  let chart_element = document.createElement('div');
  chart_element.className = "col-6 border border-info rounded";
  newRow.appendChild(chart_element);
  let element = `<div id="chart-${chartNumber}"></div>`;
  chart_element.innerHTML += element;

  // should be able to put javascript style formula in here
  let listme = [`${legend}`];
  let IC_dot = ['ICcrit'];
  let x_labels = ['IC'];
  // let normalNumbers = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
  // let normalNumbers = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
  let normalNumbers = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 10.0, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
  
  let normalNumbersTemp = normalNumbers;
  normalNumbersTemp.push(transistorContents[index]['primaryCalculation']['IC_CRIT_min'])
  normalNumbersTemp.sort((a, b) => a - b)

  for (let item in normalNumbers) {
    x_labels.push(Math.log10(normalNumbers[item]))
  }
  
  let minValue = 10000;
  let maxValue = -1000;
  let digit, digitMin;

  if (xName !== "whole") {
    digit = 0.01;
    digitMin = 0.1;
    minValue = 100000000;
    maxValue = -1000;
    for (let item in value) {
        listme.push(value[item]);
        if (value[item] < minValue) {
          minValue = value[item];
        }
        if (value[item] > maxValue) {
          maxValue = value[item];
        }
    }

    // I should change this in a way that it affects the enabled tab
    let param_value = transistorContents[index]['primaryCalculation']['IC_CRIT_min'];

    let critValueIndex = normalNumbers.indexOf(param_value);
    critValueIndex++;
    for (let i = 0; i < normalNumbers.length; i++) {
      IC_dot.push(listme[critValueIndex]);
    }
    // console.log(param_value);
    // IC_dot[19] = transistorContents[0]['degreeFreedom']['IC']['value'];

    while (minValue > digitMin) {
      digitMin *= 10;
    }
    digitMin /= 10;

    if ((minValue > 0 && xName != 'S_VGF' && xName != 'S_VGF_sqrt') || xName == 'V_EFF') {
      digitMin = 0;
    }

    while (maxValue > digit) {
      digit *= 10;
    }

    minValue = digitMin;
    maxValue = digit;
    if (xName === "f_c" && maxValue < 1) {
      maxValue = 1;
    }

    let chart = bb.generate({
      "data": {
        x: "IC",
        columns: [
          x_labels,
          listme,
          IC_dot
        ],
        type: "spline",
        color: function(color, d) {
          /*if (!d.values)
            return ["red", "red", "red", "red", "red", "red", "red", "red", "red", "#1675ff", "#1675ff", "#1675ff", "#1675ff", "#1675ff", "#1675ff", "#1675ff", "#1675ff", "#1675ff", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green"][d.index];
          else*/
          if (d.values && d.id == "ICcrit") {
            return "red";
          } else {
            return "#1675ff";
          }
        },
      },
      point: {
        pattern: [
          "<g><circle cx='10' cy='10' r='0'></circle></g>"
        ]
      },
      axis: {
        x: {
          label: "IC",
          tick: {
            "format": function(x) {
                for (let i = 0; i < normalNumbers.length; i++) {
                  if (Math.log10(normalNumbers[i]) == x) {
                    return Math.pow(10, x).toFixed(2);
                  }
                }
            },
            fit: false
          }
        }
      },
      bindto: `#chart-${chartNumber}`
    });

    chart.load({
      columns: [
        listme
      ]
    });
    
    chartNumber++;
    let chart_element_log = document.createElement('div');
    chart_element_log.className = "col-6 border border-info rounded px-2";
    newRow.appendChild(chart_element_log);
    let element_log = `<div id="chartlog-${chartNumber}"></div>`;
    chart_element_log.innerHTML += element_log;
    listme_log = [];
    let IC_dot_log = [];
    for (let item in value) {
      listme_log.push(Math.pow(value[item], 10));
      IC_dot_log.push(IC_dot[item])
    }
    let chart_log = bb.generate({
      "data": {
        x: "IC",
        columns: [
          x_labels,
          listme,
          IC_dot
        ],
        type: "spline",
        color: function(color, d) {
          if (d.values && d.id == "ICcrit") {
            return "red";
          } else {
            return "#1675ff";
          }
        },
      },
      point: {
        pattern: [
          "<g><circle cx='10' cy='10' r='0'></circle></g>"
        ]
      },
      axis: {
        x: {
          label: "IC",
          tick: {
            "format": function(x) {
                for (let i = 0; i < normalNumbers.length; i++) {
                  if (Math.log10(normalNumbers[i]) == x) {
                    return Math.pow(10, x).toFixed(2);
                  }
                }
            },
            fit: false
          }
        },
        y: {
          type: "log",
          min: minValue,
          max: maxValue
        }
      },
      bindto: `#chartlog-${chartNumber}`
    });

    chart_log.load({
      columns: [
        listme
      ]
    });
  } else if (xName === "whole") {
    listmeWhole = [];
    for (let i = 0; i < 17; i++) {
      listmeWhole[i] = [];
    }
    let i = 0;
    for (const [key, val] of Object.entries(value)) {
      listmeWhole[i].push(key);
      let temp;
      temp = val;
      for (let item in temp) {
        listmeWhole[i].push(temp[item]);
      }
      i++;
    }
    let chart = bb.generate({
      "data": {
        line:
          {connectNull: true},
        x: "IC",
        columns: [
          x_labels,
          listmeWhole[0],
          listmeWhole[1],
          listmeWhole[2],
          listmeWhole[3],
          listmeWhole[4],
          listmeWhole[5],
          listmeWhole[6],
          listmeWhole[7],
          listmeWhole[8],
          listmeWhole[9],
          listmeWhole[10],
          listmeWhole[11],
          listmeWhole[12],
          listmeWhole[13],
          listmeWhole[14],
          listmeWhole[15],
          listmeWhole[16]

        ],
        type: "line",
        color: function(color, d) {
          return "#1675ff";
        },
      },
      point: {
        pattern: [
          "<g><circle cx='10' cy='10' r='0'></circle></g>"
        ]
      },
      axis: {
        x: {
          label: "IC",
          tick: {
            "format": function(x) {
                for (let i = 0; i < normalNumbers.length; i++) {
                  if (Math.log10(normalNumbers[i]) == x) {
                    return Math.pow(10, x).toFixed(2);
                  }
                }
            },
            fit: false
          }
        },
        y: {
          label: fullName
        }
      },
      bindto: `#chart-${chartNumber}`
    });

    chart.load({
      columns: [
        listmeWhole[0],
        listmeWhole[1],
        listmeWhole[2],
        listmeWhole[3],
        listmeWhole[4],
        listmeWhole[5],
        listmeWhole[6],
        listmeWhole[7],
        listmeWhole[8],
        listmeWhole[9],
        listmeWhole[10],
        listmeWhole[11],
        listmeWhole[12],
        listmeWhole[13],
        listmeWhole[14]
      ]
    });
  }
  chartNumber++;
}

/* Calculate specifications for different ICs */
function specificationCalculationChart(id, tech, type) {
  let index = findIndex(id);
  let data = transistorContents[index]['data'];
  let specificationObj = {};
  let info = transistorContents[index]["degreeFreedom"];
  let primaryCalculation = transistorContents[index]["primaryCalculation"];
  
  let I_D = info['I_D']['value'];
  let L = info['L']['value'];
  let W = info['W']['value'];

  let IC_range = [];
  for (let j = 0.01; j <= 100;) {
    IC_range.push(j);
    if (j >= 0.01 && j < 0.1) {
      j = (0.01 * 100 + j * 100) / 100;
    } else if (j >= 0.1 && j < 1) {
      j = (0.1 * 10 + j * 10) / 10;
    } else if (j >= 1 && j < 10) {
      j = (0.1 * 10 + j * 10) / 10;//1
    } else if (j >= 10 && j <= 100) {
      j += 5;//5
    } else {
      console.log("some error!");
    }
  }

  IC_range.push(transistorContents[index]['primaryCalculation']['IC_CRIT_min'])
  IC_range.sort((a, b) => a - b)

  // gate area
  let WL = [];
  for (let item in IC_range) {
    WL.push((Math.pow(L, 2) / (IC_range[item])) * (I_D / primaryCalculation['I_0']));
  }
  specificationObj['WL'] = WL;

  // B
  let B = [];
  for (let item in IC_range) {
    B.push(IC_range[item] * (1 + (IC_range[item] / primaryCalculation['IC_CRIT'])));
  }

  let A = [];
  for (let item in IC_range) {
    A.push(IC_range[item] * (1 + (IC_range[item] / (4 * primaryCalculation['IC_CRIT'])), data["beta"]['value']));
  }

  // V_EFF
  let V_EFF = [];
  for (let item in IC_range) {
    V_EFF.push(calculateVEFF(id, IC_range[item], L));
  }
  specificationObj['V_EFF'] = V_EFF;
  
  // WdivL calculation
  let WdivL = [];
  for (let item in IC_range) {
    WdivL.push((1 / IC_range[item]) * (I_D / primaryCalculation['I_0']));
  }
  specificationObj['WdivL'] = WdivL;

  // V_DS
  let V_DS = [];
  for (let item in IC_range) {
    V_DS.push(2 * primaryCalculation['U_T'] * Math.sqrt(IC_range[item] + 0.25) + 3 * primaryCalculation['U_T']);
  }
  specificationObj['V_DS'] = V_DS;

  // GMdivID
  let GMdivID = [];
  for (let item in IC_range) {
    GMdivID.push(1 / (data["n"]['value'] * primaryCalculation['U_T'] * (Math.sqrt(B[item] + 0.25) + 0.5)));
  }
  specificationObj['GMdivID'] = GMdivID;

  // GDSdivID
  let GDSdivID = [];
  for (let item in IC_range) {
    GDSdivID.push(1 / (primaryCalculation['V_A'] + data["V_DS"]['value'] ));
  }

  // V_A_DIBL
  let V_A_DIBL = [];
  let ifPmos = -1;
  if (type === 'nmos') {
    ifPmos = 1;
  }
  for (let item in IC_range) {
    V_A_DIBL.push(ifPmos * (data["n"]['value'] * primaryCalculation['U_T'] * (Math.sqrt(IC_range[item] + 0.25) + 0.5)) / (-1 * data['BL']['value'] * 0.001 * Math.pow((data['L_min']['value'] / L), data['LEXP']['value'])));
  }

  // V_A
  let V_A = [];
  let numerator, denominator;
  for (let item in IC_range) {
    numerator = primaryCalculation['V_A_CLM'] * V_A_DIBL[item];
    denominator = Number(primaryCalculation['V_A_CLM']) + Number(V_A_DIBL[item]);
    V_A.push((numerator) / (denominator));
  }

  // AV_i
  let AV_i = [];
  for (let item in IC_range) {
    AV_i.push((V_A[item]) / (data["n"]['value'] * primaryCalculation['U_T'] *(Math.sqrt(B[item] + 0.25) + 0.5)));
  }
  specificationObj['AV_i'] = AV_i;

  let mu;
  if (type === 'nmos') {
    mu = data["mu_n"]['value'];
  } else if (type === 'pmos') {
    mu = data["mu_p"]['value'];
  }

  
  // fT_i
  let fT_i = [];
  for (let item in IC_range) {
    fT_i.push((IC_range[item] / (Math.sqrt(B[item] + 0.25) + 0.5)) * ((mu * primaryCalculation['U_T']) / (Math.PI * (primaryCalculation['C_gbi_hat'] + primaryCalculation['C_gsi_hat']) * Math.pow(L, 2))) / 10);
  }
  specificationObj['fT_i'] = fT_i;

  let gamma = [];
  for (let item in IC_range) {
    gamma.push(1 / (1 + IC_range[item]) * ( (1 / 2) + (2 / 3) * IC_range[item] ));
  }
  specificationObj['gamma'] = gamma;

  // S_VG
  let S_VG = [];
  for (let item in IC_range) {
    S_VG.push(Math.pow(2.069, 2)* Math.pow((data["T"]['value'] / 300), 2) * Math.pow((data["n"]['value']), 2) * (gamma[item]) * (Math.sqrt(B[item] + 0.25) + 0.5) * (100 / I_D));
  }
  specificationObj['S_VG'] = S_VG;

  // S_VG_sqrt
  let S_VG_sqrt = [];
  for (let item in IC_range) {
    S_VG_sqrt.push(Math.sqrt(S_VG[item]));
  }
  specificationObj['S_VG_sqrt'] = S_VG_sqrt;

  let Kp_F = [];
  for (let item in IC_range) {
    Kp_F.push(data["KP_F0"]['value'] * Math.pow (1 + V_EFF[item] / data["V_KF"]['value'], 2)); 
  }

  // S_VGF
  let S_VGF = [];
  for (let item in IC_range) {
    S_VGF.push((IC_range[item] / Math.pow(L, 2)) * (primaryCalculation['I_0'] / I_D) * (Kp_F[item] / (Math.pow(data["f"]['value'], data["AF"]['value']))));
  }
  specificationObj['S_VGF'] = S_VGF;

  // S_VGF_sqrt
  let S_VGF_sqrt = [];
  for (let item in IC_range) {
    S_VGF_sqrt.push(Math.sqrt(S_VGF[item]));
  }
  specificationObj['S_VGF_sqrt'] = S_VGF_sqrt;

  let X = [];
  for (let item in IC_range) {
    X.push((((Math.sqrt(Number(IC_range[item]) + 0.25) + 0.5) + 1) / Math.pow((Math.sqrt(Number(IC_range[item]) + 0.25) + 0.5), 2)));
  }


  let C_gsi_hat = [];
  for (let item in IC_range) {
    C_gsi_hat.push((2 - X[item]) / 3);
  }

  let C_gbi_hat = [];
  for (let item in IC_range) {
    C_gbi_hat.push(((X[item] + 1) / 3) * ((data['n']['value'] - 1) / data['n']['value']));
  }

  // f_c
  let f_c = [];
  for (let item in IC_range) {
    f_c.push(Math.pow( (3.79e-13 * (300 / data["T"]['value']) * Kp_F[item] *  primaryCalculation['c_ox'] * fT_i[item] * ((C_gbi_hat[item] + C_gsi_hat[item]) / ((data["n"]['value'] * gamma[item])))) , (1 / data["AF"]['value'])));
	
  }
  specificationObj['f_c'] = f_c;

  // DV_T
  let DV_T = [];
  for (let item in IC_range) {
    DV_T.push(primaryCalculation["AV_T"] / Math.sqrt(WL[item]));
  }
  specificationObj['DV_T'] = DV_T;

  // DKpdivKp
  let DKpdivKp = [];
  for (let item in IC_range) {
    DKpdivKp.push((data["A_KP"]['value'] / Math.sqrt(WL[item])) * 100);
  }
  specificationObj['DKpdivKp'] = DKpdivKp;

  // DV_GS
  let DV_GS = [];
  for (let item in IC_range) {
    DV_GS.push((((Math.sqrt(IC_range[item]) / L) * (Math.sqrt(primaryCalculation['I_0'] / I_D))) * Math.sqrt( Math.pow(primaryCalculation['AV_T'], 2) + Math.pow((data["A_KP"]['value'] * data["n"]['value'] * (primaryCalculation['U_T'] * 1000) * Math.sqrt(B[item] + 0.25) + 0.5), 2))));
	}
  specificationObj['DV_GS'] = DV_GS;
  

  // DIDdivID
  let DIDdivID = [];
  for (let item in IC_range) {
      DIDdivID.push((((Math.sqrt(IC_range[item]) / L) * (Math.sqrt(primaryCalculation['I_0'] / I_D))) * (Math.sqrt(Math.pow(primaryCalculation['AV_T'] / (data["n"]['value'] * (primaryCalculation['U_T'] * 1000) * (Math.sqrt(B[item] + 0.25) + 0.5)), 2) + Math.pow(data["A_KP"]['value'], 2)))) * 100);
  }
  specificationObj['DIDdivID'] = DIDdivID;

  // GMIDFT
  let GMIDFT = [];
  for (let item in IC_range) {
    GMIDFT.push(GMdivID[item] * fT_i[item]);
  }
  specificationObj['GMIDFT'] = GMIDFT;

  // AVIFTI
  let AVIFTI = [];
  for (let item in IC_range) {
    AVIFTI.push(AV_i[item] * fT_i[item]);
  }
  specificationObj['AVIFTI'] = AVIFTI;

  transistorContents[index]["specificationChart"] = specificationObj;

  return specificationObj;
}

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
