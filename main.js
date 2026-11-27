// ==========================================
// الخطوة 2: الكبسلة وحماية البيانات (Classes & Encapsulation)
// ==========================================
class Student {
  // الحقول المخفية (Private Fields)
  #sub1;
  #sub2;
  #sub3;
  #attendance;

  constructor(name, sub1, sub2, sub3, attendance) {
    if (!name || name.trim() === "") {
      throw new Error("يرجى إدخال اسم الطالب بشكل صحيح.");
    }
    this.name = name.trim();
    // استدعاء دوال set للتحقق من صحة القيم فور الإنشاء
    this.sub1 = sub1;
    this.sub2 = sub2;
    this.sub3 = sub3;
    this.attendance = attendance;
  }

  // دالة مساعدة للتحقق من أن القيمة رقمية وصحيحة بين 0 و 100
  #validateValue(val, fieldName) {
    if (val === "" || val === null || isNaN(val)) {
      throw new Error(`حقل "${fieldName}" لا يمكن أن يكون فارغاً.`);
    }
    const num = Number(val);
    if (num < 0 || num > 100) {
      throw new Error(`قيمة "${fieldName}" يجب أن تكون محصورة بين 0 و 100.`);
    }
    return num;
  }

  // Setters & Getters لحماية الدرجات ونسبة الحضور
  set sub1(value) {
    this.#sub1 = this.#validateValue(value, "المادة الأولى");
  }
  get sub1() { return this.#sub1; }

  set sub2(value) {
    this.#sub2 = this.#validateValue(value, "المادة الثانية");
  }
  get sub2() { return this.#sub2; }

  set sub3(value) {
    this.#sub3 = this.#validateValue(value, "المادة الثالثة");
  }
  get sub3() { return this.#sub3; }

  set attendance(value) {
    this.#attendance = this.#validateValue(value, "نسبة الحضور");
  }
  get attendance() { return this.#attendance; }

  // حساب متوسط درجات الطالب
  getAverage() {
    return (this.#sub1 + this.#sub2 + this.#sub3) / 3;
  }
}

// ==========================================
// الخطوة 3: التفاعل مع الشاشة واصطياد الأخطاء (DOM & Try/Catch)
// ==========================================
const studentsList = [];

// الإمساك بجميع عناصر الشاشة باستخدام getElementById
const nameInput = document.getElementById("studentName");
const sub1Input = document.getElementById("subject1");
const sub2Input = document.getElementById("subject2");
const sub3Input = document.getElementById("subject3");
const attendanceInput = document.getElementById("attendance");

const addStudentBtn = document.getElementById("addStudentBtn");
const mercyBtn = document.getElementById("mercyBtn");

const errorBox = document.getElementById("errorBox");
const studentsListDisplay = document.getElementById("studentsListDisplay");
const reportBox = document.getElementById("reportBox");

// حدث الضغط على زر "إضافة طالب"
addStudentBtn.onclick = function () {
  // إخفاء صندوق الخطأ في بداية كل محاولة
  errorBox.classList.add("d-none");
  errorBox.textContent = "";

  try {
    // محاولة إنشاء كائن جديد من الكلاس Student
    const newStudent = new Student(
      nameInput.value,
      sub1Input.value,
      sub2Input.value,
      sub3Input.value,
      attendanceInput.value
    );

    // دفع الكائن إلى المصفوفة
    studentsList.push(newStudent);

    // عرض اسم الطالب في صندوق القائمة على الشاشة
    const item = document.createElement("div");
    item.className = "list-group-item d-flex justify-content-between align-items-center";
    item.innerHTML = `
      <span><strong>${newStudent.name}</strong> (الحضور: ${newStudent.attendance}%)</span>
      <span class="badge bg-primary rounded-pill">المتوسط: ${newStudent.getAverage().toFixed(2)}</span>
    `;
    studentsListDisplay.appendChild(item);

    // تفريغ حقول الإدخال
    nameInput.value = "";
    sub1Input.value = "";
    sub2Input.value = "";
    sub3Input.value = "";
    attendanceInput.value = "";

  } catch (error) {
    // التقاط الخطأ وعرضه داخل صندوق رسائل الخطأ على الشاشة
    errorBox.textContent = error.message;
    errorBox.classList.remove("d-none");
  }
};

// ==========================================
// الخطوة 4: لجنة الرأفة (Array Methods & Template Literals)
// ==========================================
mercyBtn.onclick = function () {
  // 1. Filter: استخراج الطلاب الذين يقع متوسط درجاتهم بين 40 و 49
  const strugglingStudents = studentsList.filter(student => {
    const avg = student.getAverage();
    return avg >= 40 && avg <= 49;
  });

  // 2. Map: إضافة 5 درجات رأفة لمتوسط كل طالب متعثر واستخراجه
  const adjustedStudents = strugglingStudents.map(student => {
    return {
      name: student.name,
      newAverage: student.getAverage() + 5
    };
  });

  // 3. Reduce: جمع المتوسطات الجديدة وقسمتها على عددهم مع منع القسمة على صفر
  const totalAdjustedSum = adjustedStudents.reduce((sum, item) => sum + item.newAverage, 0);
  const overallAdjustedAverage = adjustedStudents.length > 0
    ? (totalAdjustedSum / adjustedStudents.length).toFixed(2)
    : 0;

  // تجهيز أسماء الطلاب للعرض
  const namesText = adjustedStudents.length > 0
    ? adjustedStudents.map(s => `${s.name} (${s.newAverage.toFixed(2)})`).join(" ، ")
    : "لا يوجد طلاب متعثرون ضمن هذا النطاق.";

  // الطباعة على الشاشة باستخدام قوالب النصوص (Template Literals)
  reportBox.innerHTML = `
    <ul class="list-unstyled mb-0">
      <li class="mb-2"><strong>عدد الطلاب المتعثرين:</strong> ${adjustedStudents.length}</li>
      <li class="mb-2"><strong>أسماء الطلاب بعد التعديل:</strong> ${namesText}</li>
      <li><strong>المتوسط العام لدرجاتهم بعد التعديل:</strong> ${overallAdjustedAverage}</li>
    </ul>
  `;
};