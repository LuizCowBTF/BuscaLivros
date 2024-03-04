import { EMPTY, catchError, debounceTime, filter, map, switchMap, tap, throwError } from 'rxjs';
import { Component } from '@angular/core';
import { LivroService } from 'src/app/service/livro.service';
import { Item } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { FormControl } from '@angular/forms';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  mensagemErro = '';

  constructor(private service: LivroService) { }

  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(PAUSA),
      filter((valorDigitado) => valorDigitado.length >= 3),
      tap(() => console.log('Fluxo Inicial')),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
      tap((retornoAPI) => console.log(retornoAPI)),
      map((items) => this.livrosResultadoParaLivros(items)),
      catchError(() => {
        this.mensagemErro = 'Ocorreu um erro! Recarregue a pesquisa.'
        return EMPTY
/*        console.log(erro)
        return throwError(() => new Error(this.mensagemErro = 'Ocorreu um erro! Recarregue a pesquisa.'))
      */      })
    );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    })
  }
}



