import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
})
export class ClienteComponent implements OnInit {

  clientes: Cliente[] = [];
  form: Cliente = this.initCliente();
  mostrarForm = false;
  esEdicion = false;
  mensaje = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  initCliente(): Cliente {
    return {
      CLI_CEDULA_RUC: '',
      CLI_NOMBRE: '',
      CLI_APELLIDO: '',
      CLI_TELEFONO: '',
      CLI_ESTADO: ''
    }
  }

  loadClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (data) => this.clientes = data,
      error: () => alert('Error al cargar clientes')
    });
  }

  abrirCrear(): void {
    this.form = this.initCliente();
    this.esEdicion = false;
    this.mostrarForm = true;
  }

  editar(cliente: Cliente): void {
    this.form = { ...cliente };
    this.esEdicion = true;
    this.mostrarForm = true;
  }

  eliminar(id: string): void {
    if (confirm('¿Eliminar Cliente?')) {
      this.clienteService.deleteCliente(id).subscribe({
        next: () => {
          this.mensaje = 'Cliente eliminado exitosamente';
          setTimeout(() => this.mensaje = '', 3000);
          this.loadClientes();
        },
        error: () => alert('Error al eliminar cliente')
      });
    }
  }

  guardar(): void {
    const peticion = this.esEdicion
      ? this.clienteService.updateCliente(this.form.CLI_CEDULA_RUC, this.form)
      : this.clienteService.createCliente(this.form);

    peticion.subscribe({
      next: () => {
        this.mensaje = this.esEdicion
          ? 'Cliente editado exitosamente'
          : 'Cliente creado exitosamente';
        setTimeout(() => this.mensaje = '', 3000);
        this.loadClientes();
        this.cerrarForm();
      },
      error: () => {
        this.mensaje = 'Error al guardar cliente';
      }
    });
  }

  cerrarForm(): void {
    this.mostrarForm = false;
  }
}
