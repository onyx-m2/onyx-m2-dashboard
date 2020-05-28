export function load(name, version) {
  const bundle = JSON.parse(localStorage.getItem(name))
  if (bundle && bundle.version === version) {
    return bundle.data
  }
}

export function save(name, version, data) {
  localStorage.setItem(name, JSON.stringify({version, data}))
}
