const abstractController = require("./abstractController.js")
const { formToEntity } = require("../mapper/formToEntity.js")
const UndefinedIdError = require("./errors/undefinedError.js")

module.exports = class ClubController extends abstractController{
    /**
     * 
     * @param {import("../service/clubService.js")} clubService 
     */
    constructor(uploadMiddleware, bodyParser, clubService, areaService){
        super()
        this.ROUTE_BASE = "/club" 
        this.uploadMiddleware = uploadMiddleware
        this.bodyParser = bodyParser
        this.clubService = clubService
        this.areaService = areaService
    }

    /**
     * 
     * @param {import("express").Application} app 
     */
    configureRoutes(app){
        const ROUTE_BASE = this.ROUTE_BASE

        app.get(`${ROUTE_BASE}`, this.index.bind(this))
        
        app.get(`${ROUTE_BASE}/view-team?:id`, this.view.bind(this))
        
        app.get(`${ROUTE_BASE}/edit-team?:id`, this.renderEditPage.bind(this))
        app.post(`${ROUTE_BASE}/edit-team?:id`, this.uploadMiddleware.single("fotoEscudo"), this.bodyParser, this.saveEditedTeam.bind(this))
        
        app.get(`${ROUTE_BASE}/add-team`, this.renderAddPage.bind(this))
        app.post(`${ROUTE_BASE}/add-team`, this.uploadMiddleware.single("fotoEscudo"), this.bodyParser, this.saveNewTeam.bind(this))
    
        app.get(`${ROUTE_BASE}/delete-team?:id`, this.delete.bind(this))
    }
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */

    async renderAddPage(req, res){
        const isTeam = true
        const areas = await this.areaService.getAll()

        if(areas.length > 0){
            res.render("add", { layout: "layout", data:{ isTeam, areas} })
        } else{
            req.session.errors = ["Debes crear un area primero"]
            res.redirect("/club")
        }
    }
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async renderHomePage(req, res){
        res.render("home", { layout: "layout" }) 
    }
    /**
     * 
     * @param {import("express").Request} req 
     * @param {import("express").Response} res 
     */
    async renderEditPage(req, res){
        const id = Number(req.query.id)
        if(!req.query.id){throw new UndefinedIdError("Se debe introducir un ID para editar un equipo")}
        try{
            const team = await this.clubService.getById(id)
            const areas = await this.areaService.getAll()
            res.render("edit", { layout: "layout", data:{ team, areas } })
        }catch(e){
            req.session.errors = [e.message]
            res.redirect("/club")
        }
    }
    /**
     * 
     * @param {import("express").Response} res 
     * @param {import("express").Request} req
     */
    async saveEditedTeam(req, res){
        const editedTeam = formToEntity(req.body)
        if(req.file){editedTeam.fotoEscudo = `/uploads/${req.file.filename}`}
        try{
            this.clubService.saveEditedTeam(editedTeam)
            req.session.messages = [`El equipo con ID ${editedTeam.id} se edito correctamente`]
            res.redirect("/club")
        }catch(e){
            req.session.errors = [e.message]
            res.redirect("/club")
        }
    }
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async saveNewTeam(req, res){
        const newTeam = formToEntity(req.body)
        if(req.file){newTeam.fotoEscudo = `/uploads/${req.file.filename}`}
        try{
            await this.clubService.saveNewTeam(newTeam)
            req.session.messages = [`El equipo ${newTeam.nombre} se agrego correctamente`]
            res.redirect("/club")
        }catch(e){
            req.session.errors = [e.message]
            res.redirect("/club")
        }
    }
    /**
     * 
     * @param {import("express").Response} res 
     * @param {import("express").Request} req 
     */
    async index(req , res){
        const teamsResponse = await this.clubService.getAll()
        const { errors, messages } = req.session;
        if(teamsResponse === false){
            res.render("empty-team-list", { layout: "layout", data:{ teamsResponse, errors, messages } })
        } else {
            res.render("main", { layout: "layout", data:{ teamsResponse, errors, messages } })
        }
        req.session.errors = [];
        req.session.messages = [];
    }
    /**
     * 
     * @param {import("express").Response} res 
     * @param {import("express").Request} req 
     */
    async view(req, res){
        const id = Number(req.query.id)
        if(!req.query.id){throw new UndefinedIdError("Se debe introducir un ID para ver un equipo")}
        try {
            const team = await this.clubService.getById(id)
            res.render("view", { layout: "layout", data:{ team } })
        } catch (e) {
            req.session.errors = [e.message]
            res.redirect("/club")
        } 
    }
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async delete(req, res){
        const id = Number(req.query.id)
        if(!req.query.id){throw new UndefinedIdError("Se debe introducir un ID para borrar un equipo")}
        try{
            await this.clubService.delete(id)
            req.session.messages = [`El club con ID ${id} se borro correctamente`];
        }catch(e){
            req.session.errors = [e.message]
        }
        res.redirect("/club")
    }
}