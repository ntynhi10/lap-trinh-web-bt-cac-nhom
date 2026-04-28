
class StudentController {
  constructor(service) {
    this.service = service;
  }

  create = async (req, res) => {
    const data = await this.service.create(req.body);
    res.status(201).json(data);
  };

  getAll = async (req, res) => {
    const data = await this.service.getAll(req.query);
    res.json(data);
  };

  getById = async (req, res) => {
    const data = await this.service.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  };

  update = async (req, res) => {
    const data = await this.service.update(req.params.id, req.body);
    res.json(data);
  };

  delete = async (req, res) => {
    const data = await this.service.delete(req.params.id);
    res.json(data);
  };

  updateScore = async (req, res) => {
    const { score } = req.body;

    if (score < 0 || score > 100) {
      return res.status(400).json({ message: "Score invalid" });
    }

    const data = await this.service.updateScore(req.params.id, score);
    if (!data) return res.status(404).json({ message: "Not found" });

    res.json(data);
  };

  getTop = async (req, res) => {
    const data = await this.service.getTop(req.query.limit);
    res.json(data);
  };

  getAvg = async (req, res) => {
    const data = await this.service.getAvg();
    res.json(data);
  };

  search = async (req, res) => {
    const data = await this.service.search(req.query.q);
    res.json(data);
  };
}

module.exports = StudentController;