const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisement/";

//#1
const sequelize = require("../../src/db/models/index").sequelize;
const Advertisement = require("../../src/db/models").Advertisement;

describe("routes : advertisements", () => {

//#2
beforeEach((done) => {
      this.advertisement;
      sequelize.sync({force: true}).then((res) => {

       Advertisement.create({
         title: "Best Advertisement",
         description: "There is plenty of them"
       })
        .then((advertisement) => {
          this.advertisement = advertisement;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
   });

 describe("GET /advertisements/new", () => {
   it("should render a new advertisement form", (done) => {

//#4
    request.get(`${base}new`, (err, res, body) => {
      expect(err).toBeNull();
      expect(body).toContain("New Advertisement");
      done();
    });
   });
 });

 describe("POST /advertisements/create", () => {
    const options = {
      url: `${base}create`,
      form: {
        title: "Progressive Advertisement",
        description: "What's your favorite progressive advertisement?"
     }
   };
   it("should create a new advertisement and redirect", (done) => {

 //#5
   request.post(options,

 //#6
   (err, res, body) => {
      Advertisement.findOne({where: {title: "Progressive Advertisement"}})
     .then((advertisement) => {
        expect(res.statusCode).toBe(303);
        expect(advertisement.title).toBe("Progressive Advertisement");
        expect(advertisement.description).toBe("What's your favorite progressive advertisement?");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
     }
    );
   });
  });

  describe("GET /advertisements/:id", () => {
    it("should render a view with the selected advertisement", (done) => {
    request.get(`${base}${this.advertisement.id}`, (err, res, body) => {
      expect(err).toBeNull();
      expect(body).toContain("Selected Advertisement");
      done();
     });
    });
   });

  describe("GET /advertisements/:id/edit", () => {
     it("should render a view with an edit advertisement form", (done) => {
       request.get(`${base}${this.advertisement.id}/edit`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).toContain("Edit Advertisement");
         expect(body).toContain("Best Advertisement");
         done();
       });
     });
   });


   describe("POST /advertisements/:id/update", () => {
     it("should update the advertisement with the given values", (done) => {
       const options = {
         url: `${base}${this.advertisement.id}/update`,
         form: {
           title: "Best Advertisement",
           description: "There are plenty."
         }
       };
         request.post(options,
         (err, res, body) => {
         expect(err).toBeNull();

        Advertisement.findOne({
          where: { id: this.advertisement.id }
           })
           .then((advertisement) => {
             expect(advertisement.title).toBe("Best Advertisement");
             done();
           });
         });
       });
     });

  describe("POST /advertisements/:id/destroy", () => {
     it("should delete the advertisement with the associated ID", (done) => {

     Advertisement.all()
     .then((advertisement) => {

     const advertisementCountBeforeDelete = advertisement.length;
     expect(advertisementCountBeforeDelete).toBe(1);
     request.post(`${base}${this.advertisement.id}/destroy`, (err, res, body) => {
       Advertisement.all()
      .then((advertisement) => {
       expect(err).toBeNull();
       expect(advertisement.length).toBe(advertisementCountBeforeDelete - 1);
       done();
       })
      });
     });
    });
   });
  });