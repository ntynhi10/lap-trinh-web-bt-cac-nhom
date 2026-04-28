class StudentService {
  constructor(Student) {
    this.Student = Student;
  }

  create(data) {
    return this.Student.create(data);
  }

  getAll(query) {
    const { page = 1, limit = 10, major } = query;

    const filter = { isActive: true };
    if (major) filter.major = major;

    return this.Student.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
  }

  getById(id) {
    return this.Student.findById(id);
  }

  update(id, data) {
    return this.Student.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id) {
    return this.Student.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
  }

  updateScore(id, score) {
    return this.Student.findByIdAndUpdate(
      id,
      { score },
      { new: true }
    );
  }

  getTop(limit = 5) {
    return this.Student.find().sort({ score: -1 }).limit(limit);
  }

  getAvg() {
    return this.Student.aggregate([
      { $group: { _id: null, avgScore: { $avg: "$score" } } }
    ]);
  }

  search(q) {
    return this.Student.find({
      name: { $regex: q, $options: "i" }
    });
  }
}

module.exports = StudentService;