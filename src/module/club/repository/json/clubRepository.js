const AbstractClubRepository = require("../abstractRepository")
const mapper = require("../../mapper/dbMapper.js")
const { mapearDB } = require("../../mapper/dbMapper.js");
const Club = require("../../entities/club.js")

module.exports = class ClubRepository extends AbstractClubRepository{
    /**
     * @param {import("uuid")} uuid
     * @param {import("fileSystem")} fileSystem
     * @param {String} jsonDbPath
     */

     constructor(fileSystem, jsonDbPath){
        super()
        this.fileSystem = fileSystem;
        this.jsonDbPath = jsonDbPath
    }
    /**
     * 
     * @param {Number} id 
     */
    async getById(id){
        const teamList = await this.getAll()
        
        console.log(typeof teamList)
        const teamIndex = teamList.findIndex( team => team.numeroId === Number(id) )
        if(teamIndex === -1){
            throw new Error ("No se pudo encontrar el equipo solicitado")
        }
        
        return mapearDB(teamList[teamIndex])
    }
    /**
     * 
     * @param {Club} newTeam 
     */
    async saveNewTeam(newTeam){
        const teamList = this.getAll()
        const equalTeam = teamList.find( team => team.numeroId === id )
        if(!equalTeam){
            teamList.push(newTeam)
            this.writeDb(teamList)
        } else {
            throw new Error("Ya hay un equipo con ese ID")
        }
        
        return teamList
    }
    /**
     * 
     * @param {Club} editedTeam 
     */
    async saveEditedTeam(editedTeam){
        const teamList = await this.getAll()

        const teamIndex = teamList.findIndex( team => team.numeroId === editedTeam.numeroId )
        if(teamIndex === -1 ){
            throw new Error("No se pudo encontrar el equipo solicitado")
        }

        teamList.splice(teamIndex, 1, editedTeam)

        this.writeDb(teamList)
    }
/*
const teamList = await this.getAll()

        const teamIndex = teamList.findIndex( team => team.numeroId === Number(id) )
        if(teamIndex === -1){
            throw new Error ("No se pudo encontrar el equipo solicitado")
        }
        
        return mapearDB(teamList[teamIndex])
*/


    /**
     * 
     * @param {String} id 
     */
    async delete(id){
        const teamList = this.getAll()

        const teamIndex = teamList.findIndex( team => team.numeroId === id )

        if(teamIndex === -1){
            throw new Error ("No se pudo eliminar el equipo solicitado")
        }

        teamList.splice(teamIndex, 1)
        
        this.writeDb(teamList)
    }


    /**
     * @returns {Promise<Array<import("../../entities/club.js")>>}
     */
    async getAll(){
        return this.readData().map( team => mapper.mapearDB(team) )
    }
    
    /**
     * @param {Array<import("../../entities/club.js")}
     */
    readData(){
        return JSON.parse( this.fileSystem.readFileSync( this.jsonDbPath, "utf-8") )
    }
    /**
     * 
     * @param {Object} content 
     */
    writeDb(content){
        this.fileSystem.writeFileSync( this.jsonDbPath, JSON.parse(content) )
    }

}
