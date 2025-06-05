// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error('Error parsing localStorage data:', error);
    return null;
  }
}

// save data to local storage
export function setLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// get URL parameter
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// render a list with template
export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  if (!parentElement) {
    console.error('Parent element not found');
    return;
  }
  
  const htmlStrings = list.map(template);
  
  if (clear) {
    parentElement.innerHTML = "";
  }
  
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  if (!parentElement) {
    console.error('Parent element not found');
    return;
  }

  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error(`Failed to load template: ${res.status}`);
    }
    const template = await res.text();
    return template;
  } catch (error) {
    console.error('Error loading template:', error);
    return '<div>Error loading template</div>';
  }
}

// load header and footer templates
export async function loadHeaderFooter() {
  try {
    // load the header and footer templates
    const headerTemplate = await loadTemplate("partials/header.html");
    const footerTemplate = await loadTemplate("partials/footer.html");
    
    // get the header and footer elements
    const headerElement = document.getElementById("main-header");
    const footerElement = document.getElementById("main-footer");
    
    // render the templates
    if (headerElement) {
      renderWithTemplate(headerTemplate, headerElement);
    }
    
    if (footerElement) {
      renderWithTemplate(footerTemplate, footerElement);
    }
    
    // dispatch custom event
    const event = new CustomEvent("headerfooterloaded");
    document.dispatchEvent(event);
  } catch (error) {
    console.error('Error loading header/footer:', error);
  }
}

export function toTitleCase(str) {
  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}