const {Button, TextView, contentView,  Composite, CollectionView, TextInput, Device,AlertDialog} = require('tabris');
class cl_settings {
  constructor() {

    this.values = new Array();
    this.kg = 0;
    this.r_prot = 1;
    this.r_water = 30;

    this.nb_historique = 31;

  }
  save_settings(){
    var val = {"kg": this.kg, "r_prot": this.r_prot, "r_water": this.r_water, "nb_historique": this.nb_historique};
    this.interface.conf.save_config("settings",val, true);
    console.log("save settings");
    console.log(this.interface.conf.get_config("settings"));
  }
  read_settings(it= null){
    if(it != null){
      this.interface = it;
    }
    try {
      if(this.interface.conf.get_config("settings") != null){
        var values = JSON.parse(this.interface.conf.get_config("settings"));

        this.kg = values.kg;
        this.r_prot = values.r_prot;
        this.r_water = values.r_water;
        this.nb_historique = values.nb_historique;
      }

    }catch (e){

    }
  }
  init(it){
    this.interface = it;

    this.read_settings();

    this.page = this.interface.addPage("p_settings",{id: "p_settings",title: "Paramétrage",autoDispose: false});
    this.draw_settings();

    this.page.onDisappear(() => {
      new AlertDialog({
        title: 'Voulez-vous sauvegarder les changements ?',
        buttons: {ok: "Oui", cancel: "Non"}
      }).onCloseOk(({index}) => {
          this.save_settings();
      }).open();
    });
  }
  draw_settings(){
    this.comp_princ = new Composite({left: 0, top: 0,width: tabris.device.screenWidth, height: tabris.device.screenHeight - this.interface.nav.toolbarHeight, background: 'linear-gradient(#D9D9D9, #FFFFFF)'}).appendTo(this.page);
    this.inp_base_kg = new TextInput({
      id: "inp_base_kg",
      top: 'prev()',
      left: '5',
      width: tabris.device.screenWidth - 50,
      keyboard: 'decimal',
      message: 'Kg base de calcule',
      text: this.kg
      }).onInput(({text}) => {this.kg = text})
        .appendTo(this.comp_princ);
      this.inp_r_prot = new TextInput({
        top: '#inp_base_kg 12',
        left: '5',
        width: 100,
        keyboard: 'decimal',
        message: 'Prot g/kg',
        text: this.r_prot
        }).onInput(({text}) => {this.r_prot = text})
        .appendTo(this.comp_princ);

        this.inp_r_water = new TextInput({
          top: '#inp_base_kg 12',
          left: 'prev() 5',
          width: 100,
          keyboard: 'decimal',
          message: 'Eau ml/kg',
          text: this.r_water
        }).onInput(({text}) => {this.r_water = text})
          .appendTo(this.comp_princ);
          this.inp_nb_historique = new TextInput({
            top: 'prev() 12',
            left: 5,
            width: tabris.device.screenWidth - 50,
            keyboard: 'number',
            message: 'Nb historique conservés',
            text: this.nb_historique
          }).onInput(({text}) => {this.nb_historique = text})
            .appendTo(this.comp_princ);
  }
}

exports.settings = new cl_settings();
