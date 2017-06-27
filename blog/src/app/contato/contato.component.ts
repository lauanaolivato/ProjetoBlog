import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {
falha = {sucesso: false, texto: "Problemas no envio de contato!"};
  contatoForm: FormGroup;
  listaErros = [];
  listaResultado = [];

  constructor(private fb: FormBuilder, private http: Http, private zone: NgZone) { }
 
  mensagensErro = { 'nome': { 'required': 'Por Favor preencher o nome' }
,'email':{ 'required': 'Por Favor preencher o email',
'emailisValid': 'o formato do email preechido esta incorreto' },
'texto': {'required': 'por favor preencher texto',
'minlenght': 'voce precisa informar um texto com no minimo e caracteres',
'maxleght': 'o limite do texto é de 100 caracteres'} };
  
  ngOnInit() {this.buildForm(); }
buildForm(){
  this.contatoForm = this.fb.group({
  'nome': ['', [Validators.required]],
  'email': ['', [Validators.required]],
  'texto': ['', [Validators.required,  
  Validators.minLength(4), Validators.maxLength(100)]] 
});
  this.contatoForm.valueChanges
  .subscribe(data => this.onValueChanged(data));
  this.onValueChanged();
}
  onValueChanged(data?: any) {
    if (!this.contatoForm) return;
    this.listaErros = [];
    for ( const field in this.contatoForm,controls) {
    var controls = this.contatoForm.get(field);
    if (controls && controls.dirty && !controls.valid){
      for ( const error in controls.errors){
        this.listaErros.push({sucesso: false,
          texto: this.mensagensErro[field][error]});
      }
    }
  } 
}

onsubmit() {
  if (this.contatoForm.valid) {
    let headers =   new Headers  (
      { 'content-type': 'application/json'});
    let options = new RequestOptions( { headers : headers } );
    this.http.post( 'api/contato',
    JSON.stringify(this.contatoForm.value), options)
    .map(this.mapeiaResultado)
    .subscribe(recent => {
      this.zone.run(() => {
        this.resultadoEnvioContato(recent);
      })
    });
  }
}
mapeiaResultado(res: Response) { return res.json(); }

resultadoEnvioContato(res: Resultado | any) {
  var sucesso = { sucesso: true,
    texto: "Contato enviado com sucesso!"};
  this.listaResultado = [];
  if (res.success) {
    this.listaResultado.push(sucesso);
    this.contatoForm.markAsPristine();
    this.contatoForm.reset();
  } else {
    this.listaResultado.push(this.falha);
    }
  }
}
export class Resultado {
  success: false
}