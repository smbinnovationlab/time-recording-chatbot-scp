const fs = require('fs');
const req = require('request');

const b1service = require('./b1-sl');
const bydservice = require('./byd-api');
const leon = require('./leonardo');

module.exports = {
    syncDatasetsB1,
    syncDatasetsByd,
    getLabels,
    initialLabels,
    getEntities,
    setEntities,
    initialEntities
}

// sync the dataset of product items from b1 hana instances
async function syncDatasetsB1() {
    var result = await b1service.employeeList();

    if (result && result.hasOwnProperty('value') && result.value.length > 0) {
        const employees = b1service.processDataset(result);
        console.log('b1 employees with pictures length:', employees.length, '/', result.value.length);
        fs.writeFile('./app/label/datasets-b1.json', JSON.stringify(employees), 'utf-8', function (err) {
            if (err) { next(err); }
        });

        return employees;
    }

    return [];
}

// sync the dataset of employees from bydesign
async function syncDatasetsByd() {
    var result = await bydservice.employeeList();
    if (result && result.hasOwnProperty('d') && result.d.hasOwnProperty('results') && result.d.results.length > 0) {
        const employees = bydservice.processDataset(result);
        console.log('byd employees with pictures length:', employees.length, '/', result.d.results.length);
        fs.writeFile('./app/label/datasets-byd.json', JSON.stringify(employees), 'utf-8', function (err) {
            if (err) { next(err); }
        });

        return employees;
    }

    return [];
}

var _employeeLabels;
function getLabels(key) {
    if (!_employeeLabels) {
        _employeeLabels = JSON.parse(fs.readFileSync('./app/label/labels.json'));
    }

    if (key) {
        return _employeeLabels.hasOwnProperty(key) ? _employeeLabels[key] : null;
    } else {
        return _employeeLabels;
    }
}

// initial the labels.json
async function initialLabels(dataset = 'all') {
    _employeeLabels = {};
    dataset = dataset.toLowerCase();
    console.log('dataset:', dataset);

    if ((dataset == 'all' || dataset == 'b1') && fs.existsSync('./app/label/datasets-b1.json')) {
        const ds = JSON.parse(fs.readFileSync('./app/label/datasets-b1.json'));

        if (ds && ds.length > 0) {
            let count = 0;
            for (let item of ds) {
                if (item.Picture && fs.existsSync(`./app/label/pictures/b1/${item.Picture}`)) {
                    let result = await leon.faceFeatureExtraction(item.Picture, filepath = './app/label/pictures/b1/');
                    if (result && result.hasOwnProperty('predictions') && result.predictions[0].hasOwnProperty('faces') && result.predictions[0].numberOfFaces > 0 &&
                        result.predictions[0].faces[0].hasOwnProperty('face_feature') && result.predictions[0].faces[0].hasOwnProperty('face_location')) {
                        _employeeLabels[item.ApplicationUserID] = {
                            "id": item.EmployeeID,
                            "name": item.FirstName + ' ' + item.LastName,
                            "faceFeature": result.predictions[0].faces[0].face_feature,
                            "faceLocation": result.predictions[0].faces[0].face_location,
                            "application": "b1",
                            "image": item.Picture
                        };
                        count += 1;
                    } else {
                        console.log('err on face feature extraction', item.Picture)
                    }
                }
            }
            console.log('b1 employee labels:', count);
        }
    }

    if ((dataset == 'all' || dataset == 'byd') && fs.existsSync('./app/label/datasets-byd.json')) {
        const ds = JSON.parse(fs.readFileSync('./app/label/datasets-byd.json'));

        if (ds && ds.length > 0) {
            let count = 0;
            for (let item of ds) {
                if (item.InternalID && fs.existsSync(`./app/label/pictures/byd/${item.InternalID}.jpg`)) {
                    let result = await leon.faceFeatureExtraction(item.InternalID + '.jpg', filepath = './app/label/pictures/byd/');
                    if (result && result.hasOwnProperty('predictions') && result.predictions[0].hasOwnProperty('faces') && result.predictions[0].numberOfFaces > 0 &&
                        result.predictions[0].faces[0].hasOwnProperty('face_feature') && result.predictions[0].faces[0].hasOwnProperty('face_location')) {
                        _employeeLabels[item.InternalID] = {
                            "id": item.EmployeeID,
                            "name": item.FormattedName,
                            "faceFeature": result.predictions[0].faces[0].face_feature,
                            "faceLocation": result.predictions[0].faces[0].face_location,
                            "application": "byd",
                            "image": item.InternalID + '.jpg',
                        };
                        count += 1;
                    } else {
                        console.log('err on face feature extraction', item.InternalID)
                    }
                }
            }
            console.log('byd employee labels:', count);
        }
    }

    console.log('total _employeeLabels keys:', Object.keys(_employeeLabels).length);

    fs.writeFile('./app/label/labels.json', JSON.stringify(_employeeLabels), 'utf-8', function (err) {
        if (err) { next(err); }
    });


    return _employeeLabels;
}

var _entitySet;
function getEntities(key, dataset = 'all') {
    if (!_entitySet) {
        _entitySet = JSON.parse(fs.readFileSync('./app/label/entities.json'));
    }

    if (dataset != 'all') {
        return _entitySet[dataset].hasOwnProperty(key) ? _entitySet[dataset][key] : null;
    } else {
        return _entitySet;
    }
}

function setEntities(key, entities, dataset) {
    if (_entitySet.hasOwnProperty(dataset) && _entitySet[dataset].hasOwnProperty(key)) {
        _entitySet[dataset][key] = entities;
    }

    fs.writeFile('./app/label/entities.json', JSON.stringify(_entitySet), 'utf-8', function (err) {
        if (err) { next(err); }
    });
}

// initial the entities.json
async function initialEntities(dataset = 'all') {
    dataset = dataset.toLowerCase();
    _entitySet = {
        "byd": {
            "projects": [],
            "tasks": []
        },
        "b1": {
            "projects": [],
            "stages": []
        }
    };

    console.log('dataset:', dataset);
    if (dataset == 'all' || dataset == 'b1') {
        var projects = [];
        var result = await b1service.projectList();
        if (result && result.hasOwnProperty('value') && result.value.length > 0) {
            for (let item of result.value) {
                if (item.Active != 'tYES') {
                    continue; // remove the project inactive
                }
                // add the entity set
                projects.push(item);
            }

            console.log('b1 projects:', projects.length);
            _entitySet.b1.projects = projects;
        }

        var stages = [];
        var result = await b1service.stageList();
        if (result && result.hasOwnProperty('value') && result.value.length > 0) {
            for (let item of result.value) {
                // add the entity set
                stages.push(item);
            }

            console.log('b1 stages:', stages.length);
            _entitySet.b1.stages = stages;
        }
    }

    if (dataset == 'all' || dataset == 'byd') {
        var projects = [];
        var tasks = [];
        var result = await bydservice.projectList();
        if (result && result.hasOwnProperty('d') && result.d.hasOwnProperty('results') && result.d.results.length > 0) {
            for (let item of result.d.results) {
                if (item.hasOwnProperty('ProjectLifeCycleStatusCode') && item.ProjectLifeCycleStatusCode > 3) {
                    continue; // remove the project with status 4-stopped and 5-closed
                }
                // add the entity set
                projects.push(item);

                if (item.hasOwnProperty('Task') && item.Task.length > 0) {
                    for (let task of item.Task) {
                        tasks.push(task);
                    }
                }
            }

            console.log('byd projects:', projects.length);
            console.log('byd tasks:', tasks.length);
            _entitySet.byd.projects = projects;
            _entitySet.byd.tasks = tasks;
        }
    }

    fs.writeFile('./app/label/entities.json', JSON.stringify(_entitySet), 'utf-8', function (err) {
        if (err) { next(err); }
    });

    return _entitySet;
}
