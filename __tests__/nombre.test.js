import React from 'react';
import { cleanup, render, act, fireEvent, waitFor, debug } from "@testing-library/react-native";

import {normalizeInputPhone} from '../src/components/normalizeInputPhone';
import {userContext} from '../src/contexts/userContext'
jest.mock("../src/components/sendAPI.js");

afterEach(cleanup)

describe('normalizeInputPhone', () => {

    test('empty', () => {
        expect(normalizeInputPhone("")).toMatch("");
    });

    test('keep all number', () => {
        expect(normalizeInputPhone("78")).toMatch("78");
    });

    test('remove letter', () => {
        expect(normalizeInputPhone("dfgc4g")).toMatch("4");
    });

    test('remove symbole', () => {
        expect(normalizeInputPhone("'ç4ù")).toMatch("4");
    });

    test('remove + if not at the beginning', () => {
        expect(normalizeInputPhone("5+")).toMatch("5");
    });

    test('keep + at the beginning', () => {
        expect(normalizeInputPhone("+9")).toMatch("+9");
    });

    test('format xx xx xx xx xx xx...', () => {
        expect(normalizeInputPhone("124586")).toMatch("12 45 86");
    });

    test('format +xx x xx xx xx...', () => {
        expect(normalizeInputPhone("+3345788")).toMatch("+33 4 57 88");
    });

});
