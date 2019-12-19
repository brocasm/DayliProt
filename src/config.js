class cl_config {
  constructor() {

  }
  save_config(name, val, json = false){
    if(json){
      val = JSON.stringify(val);
    }
    localStorage.setItem(name, val);
    console.log(`pass save ${name}`);
  }
  get_config(name){
      return localStorage.getItem(name);
  }
}
exports.conf = new cl_config();
