class cl_config {
  constructor() {

  }
  save_config(name, val, json = false){
    if(json){
      val = JSON.stringify(val);
    }
    localStorage.setItem(name, val);
  }
  get_config(name){
      return localStorage.getItem(name);
  }
}
exports.conf = new cl_config();
