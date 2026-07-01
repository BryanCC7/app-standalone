import { Component, OnInit, signal } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ProductSalesAnalytics, SaleDataItem } from '../../services/product-sales-analytics';

@Component({
  selector: 'app-product-sales',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './product-sales.html',
  styleUrl: './product-sales.css'
})
export class ProductSales implements OnInit {
  saleData = signal<SaleDataItem[]>([]);
  topRatedData = signal<SaleDataItem[]>([]);
  loading = signal(false);

  view: [number, number] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  legendTitle = 'Leyenda';
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Categoría';
  yAxisLabel = 'Valor';

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#1E90FF', '#FF8C00', '#9932CC']
  };

  constructor(private analyticsService: ProductSalesAnalytics) {}

  ngOnInit(): void {
    this.saleData.set(this.analyticsService.getMockSalesData());
  }

  loadTopRated(): void {
    this.loading.set(true);
    this.analyticsService.getTopRatedProducts().subscribe({
      next: (data) => {
        this.topRatedData.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSelect(event: any): void {
    console.log('Item clicked', event);
  }
}
