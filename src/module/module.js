const ClubController = require("../module/club/controller/clubController")
const ClubService = require("../module/club/service/clubService")
const ClubRepository = require("./club/repository/json/clubRepository")
/**
 * 
 * @param {import("express").Application} app 
 * @param {import("rsdi").IDIContainer} container 
 */
function initClubModule(app, container){
    
    const controller = container.get("ClubController")
    controller.configureRoutes(app)
}

module.exports = {
    initClubModule,
    ClubController,
    ClubService,
    ClubRepository
}