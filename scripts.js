const courseContainer = document.getElementById('course-container');
const addCourseBtn = document.getElementById('add-course');
const removeCourseBtn = document.getElementById('remove-course');
const checkCoursesBtn = document.getElementById('check-courses');
const outputDiv = document.getElementById('output');
const yearOption = document.getElementById("year")
let requiredCourseCount = 6;
let requiredCreidtHour = 0;
// Load course data from JSON file
let courseData = [];
fetch('courses.json')
    .then(response => response.json())
    .then(data => {
        courseData = data;
    })
    .catch(error => {
        console.error('Error fetching course data:', error);
    });

// Add new input field
addCourseBtn.addEventListener('click', () => {
    const newInput = document.createElement('div');
    newInput.className = 'container';
    newInput.innerHTML = '<input type="text" placeholder="Enter course number" class="course-input">';
    courseContainer.appendChild(newInput);
});

// Remove the last input field
removeCourseBtn.addEventListener('click', () => {
    const containers = document.querySelectorAll('.container');
    if (containers.length > 1) {
        courseContainer.removeChild(containers[containers.length - 1]);
    }
});

// Check entered courses against the JSON data
checkCoursesBtn.addEventListener('click', () => {
    UpdateInfo()
});
yearOption.addEventListener('click',()=>{
    //console.log(yearOption.value)

    if(yearOption.value == 2023)
    {
            requiredCreidtHour = 19;
            requiredCourseCount = 6;
    }
    if(yearOption.value == 2019)
    {
            requiredCreidtHour = 21;
            requiredCourseCount = 6;
    }
    if(yearOption.value == 2018)
    {
            requiredCreidtHour = 24;
            requiredCourseCount = 7;
    }
    document.getElementById('Require2').innerHTML = `>= ${requiredCreidtHour} credits` ;
    document.getElementById('Require3').innerHTML = `>= ${requiredCourseCount} courses` ;
    UpdateInfo();
});

// add text Boxs to event 
courseContainer.addEventListener('input',UpdateInfo)

// Update requirement table and print out information
function UpdateInfo(event) {
     
    const courses = document.querySelectorAll('.course-input');
    const enteredCourses = Array.from(courses).map(input => input.value.trim().toUpperCase());
    const areaCounts = {};
    let addedCourseNumber=[];
    let totalCreditHour = 0;
    let totalCourseCount = 0;
    

    const matchedCourses = enteredCourses.map(courseNumber => {
        let found = null;

        // Iterate over each elective area and its courses
        for (const area of courseData) {
            const match = area.courses.find(course => course.courseNumber === courseNumber);
            if (match) {
                if(!(addedCourseNumber.includes(courseNumber)))
                    addedCourseNumber.push(courseNumber)
                else
                    return "Repeated Course";
                found = `${match.courseNumber}: ${match.courseName} (${match.credits} credits, ${area.electiveArea})`;
                areaCounts[area.electiveArea] = (areaCounts[area.electiveArea] || 0) + 1;
                totalCreditHour = totalCreditHour + match.credits;
                totalCourseCount = totalCourseCount + 1;
                break;
            }
        }

        if (found)
            return found;
        //console.log(addedCourseNumber)
        if (courseNumber === "")
            return "";
        else
            return `${courseNumber}: Not Found`;
        
    });
    const areasWithThreeCourses = Object.keys(areaCounts).filter(area => areaCounts[area] >= 3);

    outputDiv.innerHTML = `<ul>${matchedCourses.map(course => `<li>${course}</li>`).join('')}</ul>`;

    document.getElementById('result1').innerHTML = areaCounts[areasWithThreeCourses];
    document.getElementById('result2').innerHTML = totalCreditHour;
    document.getElementById('result3').innerHTML = totalCourseCount;
    

    if (areasWithThreeCourses.length > 0) {
        document.getElementById('check1').innerHTML = 'Met';
        document.getElementById('note1').innerHTML = areasWithThreeCourses;
    
    } else {
        document.getElementById('check1').innerHTML = 'Not met';
        document.getElementById('note1').innerHTML = "select at least 3 courses from the same elective area";
    }

    if (totalCreditHour >= requiredCreidtHour) {
        document.getElementById('check2').innerHTML = 'Met';
        document.getElementById('note2').innerHTML = '';
    } else {
        document.getElementById('check2').innerHTML = 'Not met';
        let neededCreditHour = requiredCreidtHour - totalCreditHour;
        document.getElementById('note2').innerHTML = `Need ${neededCreditHour} more credits`;
    }

    if (totalCourseCount >= requiredCourseCount) {
        document.getElementById('check3').innerHTML = 'Met';
        document.getElementById('note3').innerHTML = '';
    } else {
        document.getElementById('check3').innerHTML = 'Not met';
        let NeededCourseCount = requiredCourseCount- totalCourseCount;
        document.getElementById('note3').innerHTML = `Need ${NeededCourseCount} more courses`;
    }
}