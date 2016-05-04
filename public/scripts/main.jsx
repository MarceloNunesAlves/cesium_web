var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var MainContent = React.createClass({
    render: function() {
        return (
                <div className="mainContent">
                <ProjectsTabContent />
                </div>
        );
    }
});

var ProjectsTabContent = React.createClass({
    getInitialState: function() {
        return {
            newProjectFormFields: {
                "Project Name": "",
                "Description/notes": "",
                "Additional Authorized Users": ""
            },
            projectsList: [{"name": "", "created": "", "id": ""}]
        };
    },
    componentDidMount: function() {
        this.loadProjectsListFromServer();
    },
    loadProjectsListFromServer: function() {
        $.ajax({
            url: "/get_list_of_projects",
            dataType: "json",
            cache: false,
            success: function(data) {
                this.setState({projectsList: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("/get_list_of_projects", status, err.toString(),
                              xhr.repsonseText);
            }.bind(this)
        });
    },
    handleNewProjectFormSubmit: function(e) {
        e.preventDefault();
        $.ajax({
            url: "/newProject",
            dataType: "json",
            type: "POST",
            data: this.state.newProjectFormFields,
            success: function(data) {
                this.setState({
                    projectsList: data,
                    newProjectFormFields: {
                        "Project Name": "",
                        "Description/notes": "",
                        "Additional Authorized Users": ""}});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("/newProject", status, err.toString(),
                              xhr.repsonseText);
            }.bind(this)
        });
    },
    handleDeleteProject: function(projectID, e) {
        $.ajax({
            url: "/deleteProject",
            dataType: "json",
            type: "POST",
            data: {"project_key": projectID},
            success: function(data) {
                this.setState({projectsList: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("/deleteProject", status, err.toString(),
                              xhr.repsonseText);
            }.bind(this)
        });
    },
    handleNewProjectFormTextInputChange: function(inputName, e) {
        var ff = this.state.newProjectFormFields;
        ff[inputName] = e.target.value;
        this.setState({newProjectFormFields: ff});
    },
    render: function() {
        return (
                <div className="projectsTabContent">
                <NewProjectForm
            handleNewProjectFormTextInputChange={this.handleNewProjectFormTextInputChange}
            newProjectFormFields={this.state.newProjectFormFields}
            handleNewProjectFormSubmit={this.handleNewProjectFormSubmit}
                />
                <ProjectList
            projectsList={this.state.projectsList}
            deleteProject={this.handleDeleteProject}
                />
                </div>
        );
    }
});

var NewProjectForm = React.createClass({
    render: function() {
        return (
                <div className="formTableDiv">
                <FormTitleRow formTitle="Create a new project"
                />
                <TextInputRow inputName="Project Name"
            value={this.props.newProjectFormFields["Project Name"]}
            handleNewProjectFormTextInputChange={this.props.handleNewProjectFormTextInputChange}
                />
                <TextareaInputRow inputName="Description/notes"
            value={this.props.newProjectFormFields["Description/notes"]}
            handleNewProjectFormTextInputChange={this.props.handleNewProjectFormTextInputChange}
            multiline
                />
                <TextareaInputRow inputName="Additional Authorized Users"
            value={this.props.newProjectFormFields["Additional Authorized Users"]}
            handleNewProjectFormTextInputChange={this.props.handleNewProjectFormTextInputChange}
            multiline
                />
                <div className="submitButtonDiv" style={{marginTop: 15}}>
                <input type="submit"
            onClick={this.props.handleNewProjectFormSubmit}
            value="Submit"
            className="submitButton"
                />
                </div>
                </div>
        );
    }
});

var ProjectList = React.createClass({
    render: function() {
        var projectNodes = this.props.projectsList.map(function(project) {
            return (
                    <ProjectListRow
                project={project}
                key={project.id}
                deleteProject={this.props.deleteProject}
                    />
            );
        }.bind(this));
        return (
                <div className="projectListDiv" style={{marginTop: 40}}>
                <h3>Existing Projects</h3>
                <div style={{width: 320, float: 'left'}}>
                <b>Name</b>
                </div>
                <div style={{marginLeft: 20, width: 320, float: 'left'}}>
                <b>Date Created</b>
                </div>
                <div style={{marginLeft: 710}}>
                <b>Delete Project</b>
                </div>
                <div>
                <ReactCSSTransitionGroup
            transitionName="projectsListItems"
            transitionEnterTimeout={200}
            transitionLeaveTimeout={200}>
                {projectNodes}
            </ReactCSSTransitionGroup>
                </div>
                </div>
        );
    }
});

var ProjectListRow = React.createClass({
    render: function() {
        return (
                <div>
                <div style={{width: 320, float: 'left'}}>
                {this.props.project.name}
            </div>
                <div style={{marginLeft: 20, width: 320, float: 'left'}}>
                {this.props.project.created}
            </div>
                <div style={{marginLeft: 710}}>
                <a href="#" onClick={this.props.deleteProject.bind(null, this.props.project.id)}>
                <span className="glyphicon glyphicon-trash"></span>
                </a>
                </div>
                </div>
        );
    }
});

var TextInputRow = React.createClass({
    render: function() {
        return (
                <div className="textInputRow">
                <div className="textInputTitle"
            style={{width: 320, float: 'left', marginTop: 5}}>
                {this.props.inputName}
            </div>
                <div className="textInputField"
            style={{marginLeft: 340, marginTop: 5}}>
                <input type="text"
            value={this.props.value}
            onChange={this.props.handleNewProjectFormTextInputChange.bind(null, this.props.inputName)}
                />
                </div>
                </div>
        );
    }
});

var TextareaInputRow = React.createClass({
    render: function() {
        return (
                <div className="textareaInputRow">
                <div className="textInputTitle"
            style={{width: 320, float: 'left', marginTop: 5}}>
                {this.props.inputName}
            </div>
                <div className="textareaInputField"
            style={{marginLeft: 340, marginTop: 5}}>
                <textarea
            value={this.props.value}
            onChange={this.props.handleNewProjectFormTextInputChange.bind(null, this.props.inputName)}
                />
                </div>
                </div>
        );
    }
});

var FormTitleRow = React.createClass({
    render: function() {
        return (
                <div className="formTitleDiv" style={{marginTop: 30}}>
                <h3>
                {this.props.formTitle}
            </h3>
                </div>
        );
    }
});