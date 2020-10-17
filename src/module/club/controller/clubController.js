const abstractController = require("./abstractController.js")
const formMapper = require("../mapper/formToEntity.js")

module.exports = class ClubController extends abstractController{
    /**
     * 
     * @param {import("../service/clubService.js")} clubService 
     */
    constructor(uploadMiddleware, bodyParser, clubService){
        super()
        this.ROUTE_BASE = "/club" 
        this.uploadMiddleware = uploadMiddleware
        this.bodyParser = bodyParser
        this.clubService = clubService
    }

    /**
     * 
     * @param {import("express").Application} app 
     */
    configureRoutes(app){
        const ROUTE_BASE = this.ROUTE_BASE

        app.get(`${ROUTE_BASE}`, this.index.bind(this))
        
        app.get(`${ROUTE_BASE}/view-team?:id`, this.view.bind(this))
        
        app.get(`${ROUTE_BASE}/edit-team?:id`, this.edit.bind(this))
        app.post(`${ROUTE_BASE}/edit-team?:id`, this.uploadMiddleware.single("fotoEscudo"), this.bodyParser, this.saveEditedTeam.bind(this))
        
        app.get(`${ROUTE_BASE}/add-team`, this.add.bind(this))
        app.post(`${ROUTE_BASE}/add-team`, this.uploadMiddleware.single("fotoEscudo"), this.bodyParser, this.saveNewTeam.bind(this))
    
        app.get(`${ROUTE_BASE}/delete-team?:id`, this.delete.bind(this))
    }
    
    /**
     * 
     * @param {import("express").Response} res 
     * @param {import("express").Request} req
     */
    async saveEditedTeam(req, res){

        const editedTeam = formMapper.formToEntity(req.body)

        if(req.file){
            const { path } = req.file
            editedTeam.fotoEscudo = path
        }

        this.clubService.saveEditedTeam(editedTeam)

        return res.redirect("/")
    }

    /**
     * 
     * @param {import("express").Response} res 
     * @param {import("express").Request} req 
     */
    async edit(req, res){

        const equipo = await this.clubService.getById(req.query.id)

        res.render("edit-team", {
            layout: "layout",
            data:{
                equipo
            }
        })

    }
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async add(req, res){

        res.render("add-team", {
            layout: "layout"
        })

    }
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async saveNewTeam(req, res){

        const newTeam = formMapper.formToEntity(req.body)

        if(req.file){
            const { path } = req.file
            newTeam.fotoEscudo = path
        }
        
        this.clubService.saveNewTeam(newTeam)

        res.redirect("/")
    }
    /**
     * 
     * @param {import("express").Response} res 
     * @param {import("express").Request} req 
     */
    async index(req , res){

        const teamList = await this.clubService.getAll()

        res.render("main", {
            layout: "layout",
            data:{
                teamList
            }
        })
    }

    /**
     * 
     * @param {import("express").Response} res 
     * @param {import("express").Request} req 
     */
    async view(req, res){

        const team = await this.clubService.getById(req.query.id)

        res.render("view-team", {
            layout: "layout",
            data:{
                team
            }
        })

    }
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async delete(req, res){

        this.clubService.delete(req.query.id)
    
        return res.redirect("/")
    }


}