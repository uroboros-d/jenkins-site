const assert = require("assert");
const http = require("http");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe("Website", function () {
  it("should return 200", function (done) {
    http
      .get("http://localhost:8081", function (response) {
        assert.equal(response.statusCode, 200);
        done();
      })
      .on("error", function (err) {
        done(err);
      });
  });
});

describe("HTML Content", function () {
  let document;

  before(function (done) {
    http
      .get("http://localhost:8081", function (response) {
        let data = "";
        response.on("data", (chunk) => (data += chunk));
        response.on("end", () => {
          const dom = new JSDOM(data);
          document = dom.window.document;
          done();
        });
      })
      .on("error", function (err) {
        done(err);
      });
  });

  it("should have the correct title", function () {
    assert.strictEqual(
      document.querySelector("title").textContent,
      "Как начать тестирование"
    );
  });

  it("should have a header with correct text", function () {
    assert.strictEqual(
      document.querySelector("h1").textContent,
      "Как начать тестирование"
    );
  });

  it("should have a list with four items", function () {
    const listItems = document.querySelectorAll("ul li");
    assert.strictEqual(listItems.length, 4);
  });

  it("list should contain correct items", function () {
    const listItems = document.querySelectorAll("ul li");
    assert.strictEqual(listItems[0].textContent, "Изучить основы тестирования");
    assert.strictEqual(
      listItems[1].textContent,
      "Практиковаться на реальных проектах"
    );
    assert.strictEqual(
      listItems[2].textContent,
      "Изучить инструменты автоматизации"
    );
    assert.strictEqual(
      listItems[3].textContent,
      "Подготовиться к сертификации"
    );
  });
});
