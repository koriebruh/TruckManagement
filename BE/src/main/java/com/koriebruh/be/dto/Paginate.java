package com.koriebruh.be.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Paginate<T> {

    private List<T> data;

    private int page;

    private int size;

    private long totalElements;

    private int totalPages;
}