///// Variables 
const responseInputs = document.querySelectorAll('input[id^="response-"]'),
      questionContainers = document.querySelectorAll('#questionContainer'),
      candidateContainers = document.querySelectorAll('[id^="candidate-"]'),
      quizResultContainer = document.querySelector('#quizResult')


///// Eventlisteners 
responseInputs.forEach(input => {
  input.addEventListener('change', () => {
    let inputId = input.id.split('-')[1]
    let questionId = input.dataset.question

    if (input.checked) {
      fetchResponse(inputId, questionId)
    }
  })
})


///// Update quiz responses
async function fetchResponse(rData, qData) {

  // Resets
  candidateContainers.forEach(wrapper => {
    if (wrapper.dataset.question === qData) {
      wrapper.innerHTML = ''
    }
  })

  // Get response serializer
  const serializer = await fetch(`/response/${rData}`),
        response = await serializer.json(),
        candidates = await response.candidate,
        allResponseContainer = document.querySelector(`#candidate-${response.question.id}`),
        candidateContainer = document.createElement('div')
        
  candidateContainer.setAttribute('class', 'd-flex gap-flex-col-3')
  candidates.forEach(person => {

    // 1. Create elements
    let body = document.createElement('div'),
        wrapper = document.createElement('div'),
        profile_img = document.createElement('img'),
        candidate_name = document.createElement('div')

    // 2. Set attributes
    profile_img.setAttribute('src', `${person.profile_photo}`)
    profile_img.setAttribute('alt', `${person.f_name} ${person.l_name} photo`)
    profile_img.setAttribute('class', 'candidate-profile-img')
    candidate_name.setAttribute('id', 'fullName')
    candidate_name.setAttribute('class', 'candidate-profile-name')
    candidate_name.innerHTML = `${person.f_name} ${person.l_name}`

    // 3. Append to wrapper
    wrapper.setAttribute('id', `person-${person.id}`)
    wrapper.setAttribute('class', 'd-grid d-justify-center gap-row-1')
    wrapper.append(profile_img)
    wrapper.append(candidate_name)

    // 4. Append wrapper to container
    candidateContainer.append(wrapper)
  })

  // 5. Create section header
  if (candidates) {
    let sectionHeading = document.createElement('div')
    sectionHeading.innerHTML = '<h6 class="text-weigh-normal">Who Agrees with You</h6>'

    allResponseContainer.append(sectionHeading)
    allResponseContainer.append(candidateContainer)
  }

  // Push checked input into array
  const responses = Array.from(responseInputs).filter(input => input.checked)

  // If responses === questions.length show result
  if (responses.length === questionContainers.length) {
    showQuizResult()
  }
}


///// Show quiz result
async function showQuizResult() {
  // Reset
  quizResultContainer.innerHTML = ''
  
  // All selected candidates
  const selectedCandidates = Array.from(document.querySelectorAll('[id^="person-"]')),
        uniqueCandidates = []

  let candidateObjs = []

  // Push obj to array
  candidateObjs = selectedCandidates.map(element => {
    return {
      "id": element.id,
      "name": element.querySelector('div#fullName').innerHTML,
      "image": element.querySelector('img').getAttribute('src')
    }
  })

  // Count candidate occurrences
  const candidateTally = candidateObjs.reduce( (acc, obj) => {
    return {...acc, [obj.id]: (acc[obj.id] || 0) + 1}
  }, {})

  console.log(candidateTally)

  // Remove duplicate candidate objects
  candidateObjs.map(obj => uniqueCandidates.filter(item => item.id == obj.id).length > 0 ? null : uniqueCandidates.push(obj));

  // Insert tally to obj
  for (const [key, value] of Object.entries(candidateTally)) {
    uniqueCandidates.forEach(obj => {
      if (key === obj.id) {
        obj.count = value
      }
    })
  }

  console.log(uniqueCandidates)

  // Sort by count
  uniqueCandidates.sort( (a, b) => {
    return b.count - a.count;
  })

  console.log(uniqueCandidates)

  // Create element and append to results
  const allWrapperContent = document.createElement('div'),
        resultHeading = document.createElement('div')

  allWrapperContent.setAttribute('class', 'result-wrappers')
  uniqueCandidates.forEach(person => {
    // 1. Create elements
    let wrapper = document.createElement('div'),
        profile_img = document.createElement('img'),
        detail_wrapper = document.createElement('div'),
        // candidate_name = document.createElement('h1'),
        // candidate_website = document.createElement('p'),
        counter = document.createElement('div')

    // 2. Set attributes
    wrapper.setAttribute('class', 'result-wrapper')
    profile_img.setAttribute('src', `${person.image}`)
    profile_img.setAttribute('alt', `${person.name} photo`)
    profile_img.setAttribute('class', 'result-profile-img')
    detail_wrapper.setAttribute('class', 'result-profile-name')
    detail_wrapper.innerHTML = `<h3>${person.name}</h3><p>${person.website}</p>`
    counter.setAttribute('class', 'result-counter')
    counter.innerHTML = `<span>${person.count}</span>`

    // 3. Append to wrapper
    // detail_wrapper.append(candidate_name)
    wrapper.append(counter)
    wrapper.append(profile_img)
    wrapper.append(detail_wrapper)

    // 4. Append wrapper to div
    allWrapperContent.append(wrapper)
  })

  // 5. Create result header
  resultHeading.innerHTML = '<h2 class="text-weigh-normal">Who Agrees with You Most</h2>'

  quizResultContainer.append(resultHeading)
  quizResultContainer.append(allWrapperContent)


}