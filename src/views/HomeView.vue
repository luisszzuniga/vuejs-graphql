<script setup>
import gql from 'graphql-tag'
import { useQuery, useMutation, useSubscription } from '@vue/apollo-composable'
import Loading from '@/components/Loading.vue';
import { ref, watch } from 'vue'

const VEHICLES_QUERY = gql`
  query {
    vehicles {
      id
      immatriculation
    }
  }
`;
const { result, loading, error } = useQuery(VEHICLES_QUERY);
const vehicles = ref([]);
watch(result, (newValue) => {
  vehicles.value = newValue.vehicles;
});

const VEHICLE_MUTATION = gql`
  mutation UpdateVehicle($id: Int!, $immatriculation: String!){
      updateVehicle(id: $id, updateVehicleData: { immatriculation: $immatriculation }) {
        id
        immatriculation
      }
    }
`;
const { mutate } = useMutation(VEHICLE_MUTATION);

const VEHILCE_SUBSCRIPTION = gql`
  subscription VehicleChange {
    vehicleChange {
      id
      immatriculation
    }
  }
`;
const { result: subscriptionResult } = useSubscription(VEHILCE_SUBSCRIPTION);
watch(subscriptionResult, (newValue) => {
  vehicles.value = newValue.vehicleChange;
});

const editVehicle = ref(null);
const editVehicleForm = ref({
  immatriculation: '',
  id: null,
});

const setEditVehicle = (vehicle) => {
  editVehicle.value = vehicle;

  editVehicleForm.value.immatriculation = vehicle.immatriculation;
  editVehicleForm.value.id = vehicle.id;
};

const submit = () => {
  mutate({
    id: parseInt(editVehicleForm.value.id),
    immatriculation: editVehicleForm.value.immatriculation,
  });

  editVehicle.value = null;
};
</script>

<template>
  <main>
    VEHICLES

    <Loading v-if="loading" />

    <table v-else>
      <thead>
        <th>ID</th>
        <th>Immat</th>
        <th>Actions</th>
      </thead>
      <tbody>
        <tr v-for="vehicle in vehicles" :key="vehicle.id">
          <td>{{ vehicle.id }}</td>
          <td>{{ vehicle.immatriculation }}</td>
          <td>
            <span @click="setEditVehicle(vehicle)" style="cursor: pointer;">Edit</span>
          </td>
        </tr>
      </tbody>
    </table>


    <form v-if="editVehicle" @submit.prevent="submit()">
      <input type="text" placeholder="immat" v-model="editVehicleForm.immatriculation">
      <button type="submit">Submit</button>
    </form>
  </main>
</template>

<style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    font-family: Arial, sans-serif;
    color: #333;
    margin-top: 20px;
}

thead {
    background-color: #4CAF50;
}

thead th {
    color: white;
    padding: 10px;
    text-align: left;
    border-bottom: 2px solid #ddd;
}

tbody td {
    border: 1px solid #ddd;
    padding: 8px;
}

tbody tr:nth-child(even) {
    background-color: #f2f2f2;
}

tbody tr:hover {
    background-color: #ddd;
}
</style>