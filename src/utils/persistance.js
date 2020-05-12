export function load(name) {
  return JSON.parse(localStorage.getItem(name))
}

export function save(name, data) {
  localStorage.setItem(name, JSON.stringify(data))
}
